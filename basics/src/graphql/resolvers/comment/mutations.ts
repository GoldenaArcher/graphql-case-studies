import type {
  MutationCreateCommentArgs,
  MutationResolvers,
} from "../../../generated/graphql";
import comments from "./data";
import posts from "../post/data";
import users from "../user/data";

export const commentMutations: Pick<MutationResolvers, "createComment"> = {
  createComment: (
    _parent,
    { data: { text, author, post } }: MutationCreateCommentArgs
  ) => {
    const userExists = users.some((user) => user.id === author);
    const postExists = posts.some((p) => p.id === post && p.published);

    if (!userExists) throw new Error("User not found");
    if (!postExists) throw new Error("Post not found");

    const newComment = {
      id: crypto.randomUUID(),
      text,
      userId: author,
      postId: post,
    };
    comments.push(newComment);
    return newComment as any;
  },
};
