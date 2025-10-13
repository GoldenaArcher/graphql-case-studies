import type {
    PostConnection,
    QueryResolvers,
} from "../../../generated/graphql";

import postService from "../../../services/post.service";

export const postQueries: Pick<QueryResolvers, "post" | "posts"> = {
    post: async (_parent, { id }) => await postService.findPostById(id),
    posts: async (
        _parent,
        { where, first, skip, after },
    ): Promise<PostConnection> => {
        return await postService.findAvailablePosts(
            where ?? undefined,
            first,
            skip,
            after,
        );
    },
};
