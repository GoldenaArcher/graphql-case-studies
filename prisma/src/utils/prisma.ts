export function buildFindManyArgs<
    T extends {
        where?: any;
        take?: number;
        skip?: number;
        cursor?: T["cursor"];
        orderBy?: T["orderBy"];
    },
>(
    where: T["where"] | null | undefined,
    take?: number | null,
    skip?: number | null,
    cursor?: string | null | undefined,
    extra?: Omit<T, "where" | "take" | "skip" | "cursor" | "orderBy">,
): T {
    const args: Partial<T> = { ...extra };

    if (where) {
        args.where = where;
    }
    if (take != null && take >= 0) {
        args.take = take;
    }
    if (cursor) {
        args.cursor = { id: cursor };
        args.skip = 1;
    } else if (skip != null && skip >= 0) {
        args.skip = skip;
    }

    args.orderBy = [{ createdAt: "desc" }, { id: "asc" }];

    return args as T;
}

export function buildConnection<TNode, TDbEntity extends { id: string }, TConnection>(
    items: TDbEntity[],
    after: string | null | undefined,
    hasNextPage: boolean,
    totalCount: number,
    mapper: (item: TDbEntity) => TNode
): TConnection {
    const edges = items.map((item) => ({
        node: mapper(item),
        cursor: item.id,
    }));

    const pageInfo = {
        hasNextPage,
        hasPreviousPage: Boolean(after),
        startCursor: edges.length > 0 ? edges[0]?.cursor ?? null : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1]?.cursor ?? null : null,
    };

    const aggregate = {
        count: totalCount,
    };

    return {
        edges,
        pageInfo,
        aggregate,
    } as TConnection;
}