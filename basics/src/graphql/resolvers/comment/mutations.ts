import type {
  MutationCreateCommentArgs,
  MutationDeleteCommentArgs,
  MutationResolvers,
} from "../../../generated/graphql";
import comments, { archiveComment } from "./data";
import posts from "../post/data";
import users from "../user/data";

export const commentMutations: Pick<
  MutationResolvers,
  "createComment" | "deleteComment"
> = {
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
    comments.push({
      ...newComment,
      orphaned: false,
      archived: false,
    });
    return newComment as any;
  },
  deleteComment: (_parent, { id }: MutationDeleteCommentArgs) => {
    archiveComment(id);
    return true;
  },
};
