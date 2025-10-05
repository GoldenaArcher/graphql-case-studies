import type { Prisma } from "../../generated/prisma";
import type {
    Comment,
    CommentConnection,
    CommentWhereInput,
    CreateCommentInput,
    Post,
    UpdateCommentInput,
    User,
} from "../generated/graphql";

import authService from "./auth.service";
import postService from "./post.service";

import {
    buildCommentConnection,
    mapDBCommentToComment,
} from "../graphql/resolvers/comment/comment.mapper";
import commentRepository from "../db/repository/comment.repo";
import userRepository from "../db/repository/user.repo";

import { withServiceWrapper } from "../utils/withWrapper";
import { buildFindManyArgs } from "../utils/prisma";
import { AuthError, ForbiddenError, NotFoundError } from "../errors/app.error";

const checkCommentCanBeUpdated = async (
    id: string,
    user: User | null | undefined,
): Promise<[boolean, Post]> => {
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

const findCommentById = async (id: string): Promise<Comment | null> => {
    const dbComment = await commentRepository.getCommentById(id);

    if (!dbComment) {
        return null;
    }

    return mapDBCommentToComment(dbComment);
};

const createComment = async (
    data: CreateCommentInput,
    user: User | null | undefined,
): Promise<Comment> => {
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

    return mapDBCommentToComment(
        await commentRepository.createComment(payload),
    );
};

const archiveComment = async (
    id: string,
    user: User | null | undefined,
): Promise<Comment> => {
    return updateComment(id, { archived: true }, user);
};

const updateComment = async (
    id: string,
    data: UpdateCommentInput,
    user: User | null | undefined,
): Promise<Comment> => {
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

    return mapDBCommentToComment(
        await commentRepository.updateComment(id, payload),
        post,
    );
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
