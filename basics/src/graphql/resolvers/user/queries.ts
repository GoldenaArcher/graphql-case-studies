import type {
  QueryResolvers,
  QueryUsersArgs,
  User,
} from "../../../generated/graphql";
import users from "./data";

export const userQueries: Pick<QueryResolvers, "me" | "users"> = {
  me: () =>
    ({
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      age: 30,
    } as User),
  users: (_parent, { query }: Partial<QueryUsersArgs>): User[] => {
    if (!query) return users.filter((user) => user.active) as User[];
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) && user.active
    ) as User[];
  },
};
