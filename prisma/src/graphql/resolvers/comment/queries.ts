import type { QueryResolvers } from "../../../generated/graphql";
import commentService from "../../../services/comment.service";

export const commentQueries: Pick<QueryResolvers, "comments"> = {
  comments: async (_parent, { where, first, skip, after }) => {
    return (await commentService.findAvailableComments(where ?? undefined, first, skip, after));
  },
};
