export function buildFindManyArgs<
    T extends { where?: any; take?: number; skip?: number }
>(
    where: T["where"] | null | undefined,
    take?: number | null,
    skip?: number | null,
    extra?: Omit<T, "where" | "take" | "skip">
): T {
    const args: Partial<T> = { ...extra };

    if (where) {
        args.where = where;
    }
    if (take != null && take >= 0) {
        args.take = take;
    }
    if (skip != null && skip >= 0) {
        args.skip = skip;
    }

    return args as T;
}