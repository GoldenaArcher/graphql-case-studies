import userService from "./user.service";
import { mockUsers } from "../__mocks__/mockUsers";

jest.mock("../db/repository/user.repo", () => {
    const { mockUsers } = require("../__mocks__/mockUsers");
    return {
        __esModule: true,
        default: {
            findUsers: jest.fn().mockResolvedValue(mockUsers),
            hasNextPage: jest.fn().mockResolvedValue(false),
            getTotalCount: jest.fn().mockResolvedValue(mockUsers.length),
        },
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("User Service", () => {
    it("should return user connection", async () => {
        const result = await userService.findActiveUsers();

        expect(result.edges).toHaveLength(mockUsers.length);
        expect(result.edges[0]).toEqual({
            cursor: mockUsers[0].id,
            node: mockUsers[0],
        });

        expect(result.pageInfo).toEqual({
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: mockUsers[0].id,
            endCursor: mockUsers[mockUsers.length - 1].id,
        });

        expect(result.aggregate.count).toBe(mockUsers.length);
    });
});
