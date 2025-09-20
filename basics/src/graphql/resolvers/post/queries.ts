import type { Post, QueryResolvers, User } from "../../../generated/graphql";
import posts from "./data";

export const postQueries: Pick<QueryResolvers, "post" | "posts"> = {
  post: () => ({
    id: "1",
    title: "My first post",
    body: "Hello world!",
    published: true,
    author: {} as User,
    comments: [],
  }),
  posts: (_parent, { query }): Post[] => {
    if (!query) return posts as unknown as Post[];
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
    ) as unknown as Post[];
  },
};
