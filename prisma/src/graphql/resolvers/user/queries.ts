import type {
    QueryResolvers,
    QueryUsersArgs,
    UserConnection,
} from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import userService from "../../../services/user.service";

export const userQueries: Pick<QueryResolvers, "me" | "users"> = {
    me: (_parent, _args, { user }: GraphQLContext) => {
        return userService.findById(user?.id || "");
    },
    users: async (
        _parent,
        { where, first, skip, after }: QueryUsersArgs,
    ): Promise<UserConnection> => {
        return await userService.findActiveUsers(
            where ?? undefined,
            first,
            skip,
            after,
        );
    },
};
