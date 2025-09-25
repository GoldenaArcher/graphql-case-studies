import type {
  MutationCreateCommentArgs,
  MutationDeleteCommentArgs,
  MutationResolvers,
  MutationUpdateCommentArgs,
} from "../../../generated/graphql";

import comments, { archiveComment, updateComment } from "./data";
import posts from "../post/data";
import users from "../user/data";

import type { GraphQLContext } from "../../context/type";
import { commentLogger } from "../../../utils/logger";

export const commentMutations: Pick<
  MutationResolvers,
  "createComment" | "deleteComment" | "updateComment"
> = {
  createComment: (
    _parent,
    { data: { text, author, post } }: MutationCreateCommentArgs,
    { pubsub }: GraphQLContext
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
      orphaned: false,
      archived: false,
    };

    comments.push(newComment);
    commentLogger.info({ commentId: newComment.id }, "Comment created");

    pubsub.publish(`comment:${post}`, {
      type: "CREATED",
      data: newComment as any,
    });
    commentLogger.info(
      { commentId: newComment.id },
      `Comment published to comment:CREATED:${post}`
    );

    return newComment;
  },
  deleteComment: (
    _parent,
    { id }: MutationDeleteCommentArgs,
    { pubsub }: GraphQLContext
  ) => {
    const deletedComment = archiveComment(id);
    commentLogger.info({ comment: deletedComment }, "Comment deleted");

    pubsub.publish(`comment:${deletedComment.postId}`, {
      type: "DELETED",
      data: deletedComment,
    });
    commentLogger.info(
      {
        deletedComment: {
          type: "DELETED",
          data: deletedComment,
        },
      },
      `Comment published to comment:DELETED:${deletedComment.postId}`
    );
    return true;
  },
  updateComment: (
    _parent,
    { id, data }: MutationUpdateCommentArgs,
    { pubsub }: GraphQLContext
  ) => {
    const updatedComment = updateComment(id, data);
    commentLogger.info({ comment: updatedComment }, "Comment updated");

    pubsub.publish(`comment:${updatedComment.postId}`, {
      type: "UPDATED",
      data: updatedComment,
    });
    commentLogger.info(
      {
        updatedComment: {
          type: "UPDATED",
          data: updatedComment,
        },
      },
      `Comment published to comment:UPDATED:${updatedComment.postId}`
    );

    return updatedComment as any;
  },
};
