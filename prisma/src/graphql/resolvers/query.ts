import type { QueryResolvers } from "../../generated/graphql";

import { userQueries } from "./user/queries";
import { postQueries } from "./post/queries";
import { commentQueries } from "./comment/queries";

export const Query: QueryResolvers = {
  ...userQueries,
  ...postQueries,
  ...commentQueries,
};
