import type { UserResolvers } from "../../../generated/graphql";

import posts from "../post/data";
import comments from "../comment/data";

export const userResolvers: UserResolvers = {
  posts(parent: any) {
    return posts.filter((post) => post.author === parent.id) as any;
  },
  comments(parent: any) {
    return comments.filter((comment) => comment.userId === parent.id) as any;
  },
};
