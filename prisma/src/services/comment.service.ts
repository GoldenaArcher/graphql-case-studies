import type { Prisma } from "../../generated/prisma";
import type {
    CommentConnection,
    CommentWhereInput,
    CreateCommentInput,
    UpdateCommentInput,
} from "../generated/graphql";
import type {
    User as DBUser,
    Post as DBPost,
    Comment as DBComment,
} from "../../generated/prisma";

import authService from "./auth.service";
import postService from "./post.service";

import { buildCommentConnection } from "../graphql/resolvers/comment/comment.mapper";
import commentRepository from "../db/repository/comment.repo";
import userRepository from "../db/repository/user.repo";

import { withServiceWrapper } from "../utils/withWrapper";
import { buildFindManyArgs } from "../utils/prisma";
import { AuthError, ForbiddenError, NotFoundError } from "../errors/app.error";

const checkCommentCanBeUpdated = async (
    id: string,
    user: DBUser | null | undefined,
): Promise<[boolean, DBPost]> => {
    if (!user || !user.id) {
        throw new AuthError("User not authenticated");
    }

    if (!(await userRepository.checkUserExistsAndIsActive(user.id))) {
        throw new NotFoundError("User");
    }

    const dbComment = await commentRepository.getCommentById(id);

    if (!dbComment) {
        throw new NotFoundError("Comment");
    }

    const post = await postService.findPostById(dbComment.postId);

    if (!post) {
        throw new NotFoundError("Post");
    }

    if (!authService.checkIsSameUser(user, dbComment.userId)) {
        throw new ForbiddenError("User not authorized to archive this comment");
    }

    if (!authService.checkIsSameUser(user, dbComment.userId)) {
        throw new ForbiddenError("User not authorized to update this comment");
    }

    return [true, post];
};

const findAvailableComments = async (
    where?: CommentWhereInput,
    first?: number | null,
    skip?: number | null,
    after?: string | null,
): Promise<CommentConnection> => {
    const cleaned: Prisma.CommentWhereInput = {};

    if (where?.text) cleaned.text = { ...where.text } as Prisma.StringFilter;

    const args: Prisma.CommentFindManyArgs =
        buildFindManyArgs<Prisma.CommentFindManyArgs>(
            cleaned,
            first,
            skip,
            after,
        );

    const [comments, hasNextPage, totalCount] = await Promise.all([
        commentRepository.getNonArchivedComments(args),
        commentRepository.hasNextPage(
            after ?? "",
            args.orderBy as Prisma.CommentOrderByWithRelationInput[],
            cleaned,
        ),
        commentRepository.getTotalCount(cleaned),
    ]);

    return buildCommentConnection(comments, after, hasNextPage, totalCount);
};

const findCommentById = async (id: string): Promise<DBComment | null> => {
    const dbComment = await commentRepository.getCommentById(id);

    if (!dbComment) {
        return null;
    }

    return dbComment;
};

const createComment = async (
    data: CreateCommentInput,
    user: DBUser | null | undefined,
): Promise<DBComment> => {
    if (!user || !user.id) {
        throw new AuthError("User not authenticated");
    }

    if (!(await userRepository.checkUserExistsAndIsActive(user.id))) {
        throw new NotFoundError("User");
    }

    if (!(await postService.checkPostExists(data.post))) {
        throw new NotFoundError("Post");
    }

    const payload: Prisma.CommentCreateInput = {
        text: data.text,
        post: {
            connect: {
                id: data.post,
            },
        },
        user: {
            connect: {
                id: user.id,
            },
        },
    };

    return await commentRepository.createComment(payload);
};

const archiveComment = async (
    id: string,
    user: DBUser | null | undefined,
): Promise<DBComment> => {
    return updateComment(id, { archived: true }, user);
};

const updateComment = async (
    id: string,
    data: UpdateCommentInput,
    user: DBUser | null | undefined,
): Promise<DBComment> => {
    const [canBeUpdated, post] = await checkCommentCanBeUpdated(id, user);

    if (!canBeUpdated) {
        throw new ForbiddenError(
            "Comment not found or not authorized to update",
        );
    }

    const payload: Prisma.CommentUpdateInput = {};

    if (data.text != null) {
        payload.text = data.text;
    }

    return await commentRepository.updateComment(id, payload);
};

const rawCommentService = {
    findAvailableComments,
    createComment,
    updateComment,
    archiveComment,
    findCommentById,
};

const commentService = withServiceWrapper(rawCommentService, "comment");

export default commentService;
export type CommentService = typeof commentService;
