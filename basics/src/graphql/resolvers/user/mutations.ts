import type {
  MutationCreateUserArgs,
  MutationDeleteUserArgs,
  MutationResolvers,
  User,
} from "../../../generated/graphql";

import users from "./data";

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
      ...data,
    } as User;
    users.push(newUser);
    return newUser;
  },

  deleteUser: (_parent, { id }: MutationDeleteUserArgs) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    users.splice(userIndex, 1);
    return true;
  },
};
