import type { Post, QueryResolvers } from "../../../generated/graphql";

import postService from "../../../services/post.service";

export const postQueries: Pick<QueryResolvers, "post" | "posts"> = {
  post: async (_parent, { id }): Promise<Post> => await postService.findPostById(id),
  posts: async (_parent, { where }): Promise<Post[]> => await postService.findAvailablePosts(where ?? undefined),
};
