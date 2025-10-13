import type { CommentConnection } from "../../../generated/graphql";
import type { Comment as DbComment } from "../../../../generated/prisma";
import { buildConnection } from "../../../utils/prisma";

export const buildCommentConnection = (
    comments: DbComment[],
    after: string | null | undefined,
    hasNextPage: boolean,
    totalCount: number,
): CommentConnection => {
    return buildConnection(comments, after, hasNextPage, totalCount);
};
