import type {
  QueryResolvers,
  QueryUsersArgs,
  User,
} from "../../../generated/graphql";
import { findUsers } from "../../../prisma/repository/user.repo";
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
    return (await findUsers(query ?? undefined)).map(mapDBUserToUser);
  },
};
