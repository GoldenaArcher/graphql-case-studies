import type {
    Post,
    PostConnection,
    QueryResolvers,
} from "../../../generated/graphql";

import postService from "../../../services/post.service";
import { postLogger } from "../../../utils/logger";

export const postQueries: Pick<QueryResolvers, "post" | "posts"> = {
    post: async (_parent, { id }): Promise<Post> =>
        await postService.findPostById(id),
    posts: async (
        _parent,
        { where, first, skip, after },
    ): Promise<PostConnection> => {
        postLogger.info(
            { where, first, skip, after },
            "Fetching posts with filter",
        );

        return await postService.findAvailablePosts(
            where ?? undefined,
            first,
            skip,
            after,
        );
    },
};
