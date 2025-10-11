const mockPrisma = {
    user: {
        findMany: jest.fn().mockResolvedValue([
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" },
        ]),
        create: jest
            .fn()
            .mockImplementation(({ data }) => ({ id: 3, ...data })),
    },
    post: {
        findMany: jest.fn().mockResolvedValue([]),
    },
};
export default mockPrisma;
