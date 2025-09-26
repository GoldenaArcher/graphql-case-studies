import type {
  MutationCreateUserArgs,
  MutationDeleteUserArgs,
  MutationResolvers,
  MutationUpdateUserArgs,
  User,
} from "../../../generated/graphql";
import { createUser } from "../../../prisma/repository/user.repo";

import { deactivateUser, updateUser } from "./data";
import { mapNewUserToUser } from "./user.mappers";

export const userMutations: Pick<
  MutationResolvers,
  "createUser" | "deleteUser" | "updateUser"
> = {
  createUser: async (_parent, { data }: MutationCreateUserArgs) => {
    const dbUser = await createUser(data);
    return mapNewUserToUser(dbUser);
  },
  deleteUser: (_parent, { id }: MutationDeleteUserArgs) => {
    deactivateUser(id);

    return true;
  },
  updateUser: (_parent, { id, data }: MutationUpdateUserArgs) => {
    return updateUser(id, data) as User;
  },
};
