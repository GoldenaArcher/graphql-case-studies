import type { PostResolvers } from "../../../generated/graphql";
import comments from "../comment/data";

export const postResolvers: PostResolvers = {
  comments(parent) {
    return comments.filter((comment) => comment.postId === parent.id) as any;
  },
};
