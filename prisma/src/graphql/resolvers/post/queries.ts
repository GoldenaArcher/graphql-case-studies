import type { Post, QueryResolvers } from "../../../generated/graphql";
import { findPostById, findPosts } from "../../../prisma/repository/post.repo";
import { mapDBPostToPost } from "./post.mapper";

export const postQueries: Pick<QueryResolvers, "post" | "posts"> = {
  post: async (_parent, { id }): Promise<Post> => mapDBPostToPost(await findPostById(id)),
  posts: async (_parent, { query }): Promise<Post[]> => (await findPosts(query ?? undefined)).map(mapDBPostToPost),
};
