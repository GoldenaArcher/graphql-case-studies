import type {
  MutationCreateUserArgs,
  MutationDeleteUserArgs,
  MutationResolvers,
  MutationUpdateUserArgs,
} from "../../../generated/graphql";
import { createUser, updateUser, deactivateUser } from "../../../prisma/repository/user.repo";
import { mapDBUserToUser } from "./user.mappers";

export const userMutations: Pick<
  MutationResolvers,
  "createUser" | "deleteUser" | "updateUser"
> = {
  createUser: async (_parent, { data }: MutationCreateUserArgs) => {
    const dbUser = await createUser(data);
    return mapDBUserToUser(dbUser);
  },
  deleteUser: (_parent, { id }: MutationDeleteUserArgs) => {
    deactivateUser(id);
    return true;
  },
  updateUser: async (_parent, { id, data }: MutationUpdateUserArgs) => {
    const dbUser = await updateUser(id, data);
    return mapDBUserToUser(dbUser);
  },
};
