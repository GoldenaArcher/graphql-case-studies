import type { User, UserConnection } from "../../../generated/graphql";
import type { User as DbUser } from "../../../../generated/prisma";
import { buildConnection } from "../../../utils/prisma";

export const mapDBUserToUser = (data: DbUser): User => {
    return {
        ...data,
        posts: [],
        comments: [],
    };
};

export const buildUserConnection = (
    users: DbUser[],
    after: string | null | undefined,
    hasNextPage: boolean,
    totalCount: number,
): UserConnection => {
    return buildConnection(
        users,
        after,
        hasNextPage,
        totalCount,
        mapDBUserToUser,
    );
};
