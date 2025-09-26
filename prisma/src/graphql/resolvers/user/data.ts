import users from "../../../../mock/users.json";
import type { UpdateUserInput } from "../../../generated/graphql";

export const deactivateUser = (id: string) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.active) {
    throw new Error("User is already inactive");
  }
  user.active = false;
};

export const updateUser = (id: string, data: UpdateUserInput) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    throw new Error("User not found");
  }

  const emailTaken = users.some((u) => u.email === data.email && u.id !== id);
  if (emailTaken) {
    throw new Error("Email is already taken");
  }

  if (data.email) {
    user.email = data.email;
  }

  if (data.name) {
    user.name = data.name;
  }

  if (data.age) {
    user.age = data.age;
  }

  return user;
};

export default users;
