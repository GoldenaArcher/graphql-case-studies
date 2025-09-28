import type {
  MutationActivateUserArgs,
  MutationDeleteUserArgs,
  MutationResolvers,
  MutationUpdateUserArgs,
} from "../../../generated/graphql";
import authService from "../../../services/auth.service";
import userService from "../../../services/user.service";
import type { GraphQLContext } from "../../context/type";
import { mapDBUserToUser } from "./user.mappers";

export const userMutations: Pick<
  MutationResolvers,
  "deleteUser" | "updateUser" | "activateUser"
> = {
  activateUser: async (_parent, { id }: MutationActivateUserArgs, { user }: GraphQLContext) => {
    const dbUser = await authService.activateUser(id, user);
    return mapDBUserToUser(dbUser);
  },
  deleteUser: async (_parent, { id }: MutationDeleteUserArgs, { user }: GraphQLContext) => {
    await authService.deactivateUser(id, user);
    return true;
  },
  updateUser: async (_parent, { id, data }: MutationUpdateUserArgs, { user }: GraphQLContext) => {
    const dbUser = await userService.updateUser(id, data, user);
    return mapDBUserToUser(dbUser);
  },
};
