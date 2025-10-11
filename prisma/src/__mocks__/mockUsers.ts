import type { User } from "../../generated/prisma";

export const mockUsers: User[] = [
    {
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        age: 30,
        active: true,
        password: "hashed_pw_1",
        role: "USER",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-02-01T00:00:00Z"),
    },
    {
        id: "2",
        name: "Bob",
        email: "bob@example.com",
        age: 28,
        active: true,
        password: "hashed_pw_2",
        role: "ADMIN",
        createdAt: new Date("2024-01-10T00:00:00Z"),
        updatedAt: new Date("2024-02-05T00:00:00Z"),
    },
];
