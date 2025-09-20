import type { CommentResolvers } from "../../../generated/graphql";

import posts from "../post/data";
import users from "../user/data";

export const commentResolvers: CommentResolvers = {
  author(parent: any) {
    console.log("author", parent);
    console.log("userId", parent.userId);

    return parent.userId
      ? (users.find((user) => user.id === parent.userId && user.active) as any)
      : null;
  },
  post(parent: any) {
    return posts.find(
      (post) => post.id === parent.postId && !post.archived
    ) as any;
  },
};
