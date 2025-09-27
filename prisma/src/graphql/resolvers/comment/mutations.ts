import type {
  MutationCreateCommentArgs,
  MutationDeleteCommentArgs,
  MutationResolvers,
  MutationUpdateCommentArgs,
} from "../../../generated/graphql";

import type { GraphQLContext } from "../../context/type";
import { commentLogger } from "../../../utils/logger";

import { createComment, updateComment, archiveComment } from "../../../prisma/repository/comment.repo";
import { mapDBCommentToComment } from "./comment.mapper";

export const commentMutations: Pick<
  MutationResolvers,
  "createComment" | "deleteComment" | "updateComment"
> = {
  createComment: async (
    _parent,
    { data: { text, author, post } }: MutationCreateCommentArgs,
    { pubsub }: GraphQLContext
  ) => {
    const dbComment = await createComment({
      text,
      author,
      post,
    });
    const newComment = mapDBCommentToComment(dbComment);

    commentLogger.info({ comment: newComment }, "Comment created");

    pubsub.publish(`comment:${post}`, {
      type: "CREATED",
      data: newComment
    });
    commentLogger.info(
      { comment: newComment },
      `Comment published to comment:CREATED:${post}`
    );

    return newComment;
  },
  deleteComment: async (
    _parent,
    { id }: MutationDeleteCommentArgs,
    { pubsub }: GraphQLContext
  ) => {
    const dbComment = await archiveComment(id);
    const deletedComment = mapDBCommentToComment(dbComment);
    commentLogger.info({ comment: deletedComment }, "Comment deleted");

    pubsub.publish(`comment:${dbComment.postId}`, {
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
      `Comment published to comment:DELETED:${dbComment.postId}`
    );
    return true;
  },
  updateComment: async (
    _parent,
    { id, data }: MutationUpdateCommentArgs,
    { pubsub }: GraphQLContext
  ) => {
    const dbComment = await updateComment(id, data);
    const updatedComment = mapDBCommentToComment(dbComment);

    commentLogger.info({ comment: updatedComment }, "Comment updated");

    pubsub.publish(`comment:${dbComment.postId}`, {
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
      `Comment published to comment:UPDATED:${dbComment.postId}`
    );

    return updatedComment;
  },
};
