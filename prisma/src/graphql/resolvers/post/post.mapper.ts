import type { PostConnection } from "../../../generated/graphql";
import type { Post as DbPost } from "../../../../generated/prisma";
import { buildConnection } from "../../../utils/prisma";

export const buildPostConnection = (
    posts: DbPost[],
    after: string | null | undefined,
    hasNextPage: boolean,
    totalCount: number,
): PostConnection => {
    return buildConnection(posts, after, hasNextPage, totalCount);
};
