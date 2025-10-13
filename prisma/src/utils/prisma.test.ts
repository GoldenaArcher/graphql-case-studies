import { buildFindManyArgs, buildConnection } from "./prisma";

type UserDbEntity = { id: string; name: string; upper: string };
type UserConnection = ReturnType<typeof buildConnection<UserDbEntity, any>>;

describe("buildFindManyArgs", () => {
    it("should build args with where, take, skip", () => {
        const result = buildFindManyArgs({ active: true }, 10, 5, null, {
            extraKey: "extraValue",
        } as any);

        expect(result).toMatchObject({
            where: { active: true },
            take: 10,
            skip: 5,
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
            extraKey: "extraValue",
        });
    });

    it("should use default take = 20 if invalid or missing", () => {
        const result = buildFindManyArgs(null, -1, null, null);
        expect(result.take).toBe(20);
    });

    it("should set cursor and skip correctly when cursor is provided", () => {
        const result = buildFindManyArgs(null, 5, null, "123");
        expect(result.cursor).toEqual({ id: "123" });
        expect(result.skip).toBe(1);
    });

    it("should fallback skip when cursor not provided", () => {
        const result = buildFindManyArgs(null, 5, 2, null);
        expect(result.skip).toBe(2);
    });
});

describe("buildConnection", () => {
    const items = [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
    ];

    it("should build connection with mapper", () => {
        const connection = buildConnection(items, null, false, items.length);

        expect(connection).toMatchObject({
            edges: [
                {
                    node: { id: "1", name: "Alice", upper: "ALICE" },
                    cursor: "1",
                },
                { node: { id: "2", name: "Bob", upper: "BOB" }, cursor: "2" },
            ],
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: "1",
                endCursor: "2",
            },
            aggregate: { count: 2 },
        });
    });

    it("should mark hasPreviousPage true when after cursor exists", () => {
        const connection: UserConnection = buildConnection(
            items,
            "1",
            true,
            10,
        );
        expect(connection.pageInfo.hasPreviousPage).toBe(true);
        expect(connection.pageInfo.hasNextPage).toBe(true);
    });

    it("should handle empty items gracefully", () => {
        const connection: UserConnection = buildConnection([], null, false, 0);
        expect(connection.pageInfo.startCursor).toBeNull();
        expect(connection.pageInfo.endCursor).toBeNull();
        expect(connection.aggregate.count).toBe(0);
    });
});
