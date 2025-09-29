import type { QueryResolvers } from "../../../generated/graphql";
import commentService from "../../../services/comment.service";

export const commentQueries: Pick<QueryResolvers, "comments"> = {
  comments: async () => {
    return (await commentService.findAvailableComments());
  },
};
