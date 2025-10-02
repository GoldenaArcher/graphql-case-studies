import type { Comment, CommentConnection, Post } from '../../../generated/graphql';
import type { Comment as DbComment } from '../../../../generated/prisma';
import { buildConnection } from '../../../utils/prisma';

export const mapDBCommentToComment = (data: DbComment, post?: Post): Comment => {
    return {
        ...data,
        author: null,
        post: post ?? null,
    };
};

export const buildCommentConnection = (
    comments: DbComment[],
    after: string | null | undefined,
    hasNextPage: boolean,
    totalCount: number,
): CommentConnection => {
    return buildConnection(
        comments,
        after,
        hasNextPage,
        totalCount,
        mapDBCommentToComment,
    );
};
