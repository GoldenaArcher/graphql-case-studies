import type {
  MutationActivateUserArgs,
  MutationDeleteUserArgs,
  MutationResolvers,
  MutationUpdateUserArgs,
} from "../../../generated/graphql";
import { updateUser, deactivateUser, activateUser } from "../../../prisma/repository/user.repo";
import { mapDBUserToUser } from "./user.mappers";

export const userMutations: Pick<
  MutationResolvers,
  "deleteUser" | "updateUser" | "activateUser"
> = {
  activateUser: async (_parent, { id }: MutationActivateUserArgs) => {
    const dbUser = await activateUser(id);
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
