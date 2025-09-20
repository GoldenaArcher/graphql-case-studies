import type { PostResolvers } from "../../generated/graphql";

import users from "../../../mock/users.json";
import comments from "../../../mock/comments.json";

export const postResolvers: PostResolvers = {
  author(parent: any) {
    return users.find((user) => user.id === parent.author) as any;
  },
  comments(parent: any) {
    return comments.filter((comment) => comment.postId === parent.id) as any;
  },
};
