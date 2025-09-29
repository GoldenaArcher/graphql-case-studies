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
