import type { Post, PostConnection } from "../../../generated/graphql";
import type { Post as DbPost } from "../../../../generated/prisma";
import { buildConnection } from "../../../utils/prisma";

export const mapDBPostToPost = (data: DbPost): Post => {
    return {
        ...data,
        comments: [],
        author: null,
    };
};

export const buildPostConnection = (
    posts: DbPost[],
    after: string | null | undefined,
    hasNextPage: boolean,
    totalCount: number,
): PostConnection => {
    return buildConnection(
        posts,
        after,
        hasNextPage,
        totalCount,
        mapDBPostToPost,
    );
};
