import type { Comment } from '../../../generated/graphql';
import type { Comment as DbComment } from '../../../../generated/prisma';

export const mapDBCommentToComment = (data: DbComment): Comment => {
    return {
        ...data,
        author: null,
        post: null,
    };
};
