import type { CommentResolvers } from "../../generated/graphql";

import users from "../../../mock/users.json";
import posts from "../../../mock/posts.json";

export const commentResolvers: CommentResolvers = {
  author(parent: any) {
    return users.find((user) => user.id === parent.userId) as any;
  },
  post(parent: any) {
    return posts.find((post) => post.id === parent.postId) as any;
  },
};
