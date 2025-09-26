import type { Post } from "../../../generated/graphql";
import type { Post as DbPost } from "../../../../generated/prisma";

export const mapDBPostToPost = (data: DbPost): Post => {
    return {
        ...data,
        comments: [],
        author: null,
    };
};
