import type { QueryResolvers } from "../../../generated/graphql";
import { findAvailableComments } from "../../../prisma/repository/comment.repo";
import { mapDBCommentToComment } from "./comment.mapper";

export const commentQueries: Pick<QueryResolvers, "comments"> = {
  comments: async () => {
    return (await findAvailableComments()).map(mapDBCommentToComment);
  },
};
