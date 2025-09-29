import type {
    AggregateUser,
    PageInfo,
    User,
    UserConnection,
    UserEdge,
} from "../../../generated/graphql";
import type { User as DbUser } from "../../../../generated/prisma";

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
    const edges: UserEdge[] = users.map((user) => ({
        node: mapDBUserToUser(user),
        cursor: user.id,
    }));

    const pageInfo: PageInfo = {
        hasNextPage,
        hasPreviousPage: Boolean(after),
        startCursor: edges.length > 0 ? edges[0]?.cursor ?? null : null,
        endCursor:
            edges.length > 0 ? edges[edges.length - 1]?.cursor ?? null : null,
    };

    const aggregate: AggregateUser = {
        count: totalCount,
    };

    return {
        edges,
        pageInfo,
        aggregate,
    };
};
