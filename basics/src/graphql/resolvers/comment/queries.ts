import type { QueryResolvers } from "../../../generated/graphql";

import comments from "./data";

export const commentQueries: Pick<QueryResolvers, "comments"> = {
  comments: () => {
    return comments.filter((comment) => !comment.orphaned) as any;
  },
};
