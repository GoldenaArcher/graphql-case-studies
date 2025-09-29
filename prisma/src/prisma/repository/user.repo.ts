import type { Prisma, User } from "../../../generated/prisma";
import prisma from "../index";

const repo = prisma.user;

const checkUserExists = async (id: string) => {
    return !!(await repo.findUnique({
        where: { id },
        select: { id: true },
    }));
};

const checkUserExistsAndIsActive = async (id: string | null | undefined) => {
    if (!id) {
        return false;
    }

    return !!(await repo.findUnique({
        where: { id, active: true },
        select: { id: true },
    }));
};

const isEmailTaken = async (email: string) => {
    return !!(await repo.findUnique({
        where: { email },
        select: { id: true },
    }));
};

const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
    return await repo.create({ data });
};

const updateUser = async (
    id: string,
    data: Prisma.UserUpdateInput,
): Promise<User> => {
    if (!(await checkUserExists(id))) {
        throw new Error("User not found");
    }

    if (data.email && (await isEmailTaken(data.email as string))) {
        throw new Error("Email already taken");
    }

    const payload: Prisma.UserUpdateInput = {};

    if (data.name != null) {
        payload.name = data.name;
    }

    if (data.email != null) {
        payload.email = data.email;
    }

    if (data.age != null) {
        payload.age = data.age;
    }

    if (data.active != null) {
        payload.active = data.active;
    }

    return await repo.update({
        where: { id },
        data: payload,
    });
};

const activateUser = async (id: string): Promise<User> => {
    return updateUser(id, { active: true });
};

const deactivateUser = async (id: string): Promise<User> => {
    return updateUser(id, { active: false });
};

const findUsers = async (args: Prisma.UserFindManyArgs): Promise<User[]> => {
    return await repo.findMany(args);
};

const findUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

const findUserById = async (id: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

const hasNextPage = async (
    cursorId: string,
    orderBy:
        | Prisma.UserOrderByWithRelationInput
        | Prisma.UserOrderByWithRelationInput[],
    where: Prisma.UserWhereInput,
): Promise<boolean> => {
    const next = await repo.findFirst({
        where: {
            ...where,
            id: { gt: cursorId },
        },
        orderBy,
    });

    return !!next;
};

const getTotalCount = async (where: Prisma.UserWhereInput): Promise<number> => {
    return await repo.count({ where });
};

const userRepository = {
    checkUserExists,
    checkUserExistsAndIsActive,
    isEmailTaken,
    createUser,
    updateUser,
    activateUser,
    deactivateUser,
    findUsers,
    findUserByEmail,
    findUserById,
    hasNextPage,
    getTotalCount,
};

export default userRepository;
