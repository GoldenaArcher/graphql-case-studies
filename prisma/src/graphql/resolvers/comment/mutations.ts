import type {
    MutationCreateCommentArgs,
    MutationDeleteCommentArgs,
    MutationResolvers,
    MutationUpdateCommentArgs,
} from "../../../generated/graphql";

import type { GraphQLContext } from "../../context/type";
import { commentLogger } from "../../../utils/logger";

import commentService from "../../../services/comment.service";

export const commentMutations: Pick<
    MutationResolvers,
    "createComment" | "deleteComment" | "updateComment"
> = {
    createComment: async (
        _parent,
        { data }: MutationCreateCommentArgs,
        { pubsub, user },
    ) => {
        const newComment = await commentService.createComment(data, user);

        commentLogger.info({ comment: newComment }, "Comment created");

        pubsub.publish(`comment:${newComment.postId}`, {
            type: "CREATED",
            data: newComment,
        });
        commentLogger.info(
            { comment: newComment },
            `Comment published to comment:CREATED:${newComment.postId}`,
        );

        return newComment;
    },
    deleteComment: async (
        _parent,
        { id }: MutationDeleteCommentArgs,
        { pubsub, user }: GraphQLContext,
    ) => {
        const deletedComment = await commentService.archiveComment(id, user);
        commentLogger.info({ comment: deletedComment }, "Comment deleted");

        pubsub.publish(`comment:${deletedComment.id}`, {
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
            `Comment published to comment:DELETED:${deletedComment.id}`,
        );
        return true;
    },
    updateComment: async (
        _parent,
        { id, data }: MutationUpdateCommentArgs,
        { pubsub, user }: GraphQLContext,
    ) => {
        const updatedComment = await commentService.updateComment(
            id,
            data,
            user,
        );

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
            `Comment published to comment:UPDATED:${updatedComment.postId}`,
        );

        return updatedComment;
    },
};
