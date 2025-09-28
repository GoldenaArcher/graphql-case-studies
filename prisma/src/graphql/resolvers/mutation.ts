import { userMutations } from "./user/mutations";
import { postMutations } from "./post/mutations";
import { commentMutations } from "./comment/mutations";
import type { MutationResolvers } from "../../generated/graphql";
import { authMutations } from "./auth/mutation";

export const Mutation: MutationResolvers = {
  ...userMutations,
  ...postMutations,
  ...commentMutations,
  ...authMutations
};
