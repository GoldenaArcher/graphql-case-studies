import users from "../../../../mock/users.json";

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

export default users;
