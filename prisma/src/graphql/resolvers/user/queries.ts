import type {
  QueryResolvers,
  QueryUsersArgs,
  User,
} from "../../../generated/graphql";
import { getUsers } from "../../../prisma/repository/user.repo";
import { mapDBUserToUser } from "./user.mappers";


export const userQueries: Pick<QueryResolvers, "me" | "users"> = {
  me: () =>
  ({
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    age: 30,
  } as User),
  users: async (_parent, { query }: Partial<QueryUsersArgs>): Promise<User[]> => {
    return (await getUsers(query ?? undefined)).map(mapDBUserToUser);
  },
};
