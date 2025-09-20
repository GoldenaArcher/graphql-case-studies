import type {
  MutationCreateUserArgs,
  MutationDeleteUserArgs,
  MutationResolvers,
  User,
} from "../../../generated/graphql";

import users, { deactivateUser } from "./data";

export const userMutations: Pick<
  MutationResolvers,
  "createUser" | "deleteUser"
> = {
  createUser: (_parent, { data }: MutationCreateUserArgs) => {
    const isEmailTaken = users.some((user) => user.email === data.email);
    if (isEmailTaken) {
      throw new Error("Email is already taken");
    }

    const newUser = {
      id: crypto.randomUUID(),
      active: false,
      ...data,
    } as User;
    users.push(newUser);
    return newUser;
  },

  deleteUser: (_parent, { id }: MutationDeleteUserArgs) => {
    deactivateUser(id);

    return true;
  },
};
