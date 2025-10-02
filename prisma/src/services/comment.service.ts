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

import {
    buildCommentConnection,
    mapDBCommentToComment,
} from "../graphql/resolvers/comment/comment.mapper";
import commentRepository from "../prisma/repository/comment.repo";
import userRepository from "../prisma/repository/user.repo";
import { buildFindManyArgs } from "../utils/prisma";
import authService from "./auth.service";
import postService from "./post.service";

const checkCommentCanBeUpdated = async (
    id: string,
    user: User | null | undefined,
): Promise<[boolean, Post]> => {
    if (!user || !user.id) {
        throw new Error("User not authenticated");
    }

    if (!(await userRepository.checkUserExistsAndIsActive(user.id))) {
        throw new Error("User not found or inactive");
    }

    const dbComment = await commentRepository.getCommentById(id);

    if (!dbComment) {
        throw new Error("Comment not found");
    }

    const post = await postService.findPostById(dbComment.postId);

    if (!post) {
        throw new Error("Post not found");
    }

    if (!authService.checkIsSameUser(user, dbComment.userId)) {
        throw new Error("User not authorized to archive this comment");
    }

    if (!authService.checkIsSameUser(user, dbComment.userId)) {
        throw new Error("User not authorized to update this comment");
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
        throw new Error("User not authenticated");
    }

    if (!(await userRepository.checkUserExistsAndIsActive(user.id))) {
        throw new Error("User not found or inactive");
    }

    if (!(await postService.checkPostExists(data.post))) {
        throw new Error("Post not found");
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
    const [canBeUpdated, post] = await checkCommentCanBeUpdated(id, user);

    if (!canBeUpdated) {
        throw new Error("Comment not found or not authorized to archive");
    }

    return mapDBCommentToComment(
        await commentRepository.archiveComment(id),
        post,
    );
};

const updateComment = async (
    id: string,
    data: UpdateCommentInput,
    user: User | null | undefined,
): Promise<Comment> => {
    const [canBeUpdated, post] = await checkCommentCanBeUpdated(id, user);

    if (!canBeUpdated) {
        throw new Error("Comment not found or not authorized to update");
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

const commentService = {
    findAvailableComments,
    createComment,
    updateComment,
    archiveComment,
    findCommentById,
};

export default commentService;
