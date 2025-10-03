import type { PostResolvers, User } from "../../../generated/graphql";
import comments from "../comment/data";
import users from "../user/data";

export const postResolvers: PostResolvers = {
  comments(parent: any) {
    return comments.filter((comment) => comment.postId === parent.id) as any;
  },
  author(parent: any) {
    return users.find((user) => user.id === parent.author) as User;
  },
};
