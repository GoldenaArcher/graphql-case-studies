import type { Prisma, User } from '../../../generated/prisma';
import type { RegisterInput, UpdateUserInput, UserWhereInput } from '../../generated/graphql';
import prisma from '../index';

const repo = prisma.user;

export const checkUserExists = async (id: string) => {
    return !!(await repo.findUnique({
        where: { id, },
        select: { id: true },
    }));
}

export const checkUserExistsAndIsActive = async (id: string) => {
    return !!(await repo.findUnique({
        where: { id, active: true },
        select: { id: true },
    }));
}

export const isEmailTaken = async (email: string) => {
    return !!(await repo.findUnique({
        where: { email, },
        select: { id: true },
    }));
}

const createUser = async (data: RegisterInput): Promise<User> => {
    return await repo.create({ data });
}

export const updateUser = async (id: string, data: UpdateUserInput): Promise<User> => {
    if (!(await checkUserExists(id))) {
        throw new Error('User not found');
    }

    if (data.email && await isEmailTaken(data.email)) {
        throw new Error('Email already taken');
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
}

export const activateUser = async (id: string): Promise<User> => {
    return updateUser(id, { active: true });
}

export const deactivateUser = async (id: string): Promise<User> => {
    return updateUser(id, { active: false });
}

export const findUsers = async (where: Prisma.UserWhereInput): Promise<User[]> => {
    return await prisma.user.findMany({ where });
};

const findUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { email },
    });
}

const findUserById = async (id: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { id },
    });
}

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
}

export default userRepository;