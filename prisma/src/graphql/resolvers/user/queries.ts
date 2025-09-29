import type {
    QueryResolvers,
    QueryUsersArgs,
    UserConnection,
} from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import userService from "../../../services/user.service";
import { userLogger } from "../../../utils/logger";

export const userQueries: Pick<QueryResolvers, "me" | "users"> = {
    me: (_parent, _args, { user }: GraphQLContext) => {
        if (!user) throw new Error("User not authenticated or not found");
        return user;
    },
    users: async (
        _parent,
        { where, first, skip, after }: QueryUsersArgs,
    ): Promise<UserConnection> => {
        userLogger.info(
            { where, first, skip, after },
            "Fetching users with filter",
        );

        return await userService.findActiveUsers(
            where ?? undefined,
            first,
            skip,
            after,
        );
    },
};
