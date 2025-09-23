import type { PostResolvers } from "../../../generated/graphql";
import comments from "../comment/data";
import users from "../user/data";

export const postResolvers: PostResolvers = {
  comments(parent) {
    return comments.filter((comment) => comment.postId === parent.id) as any;
  },
  author(parent) {
    return users.find((user) => user.id === (parent as any).author) as any;
  },
};
