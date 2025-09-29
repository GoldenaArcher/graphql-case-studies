import type { Comment, Post } from '../../../generated/graphql';
import type { Comment as DbComment } from '../../../../generated/prisma';

export const mapDBCommentToComment = (data: DbComment, post?: Post): Comment => {
    return {
        ...data,
        author: null,
        post: post ?? null,
    };
};
