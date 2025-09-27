import type { Prisma, User } from '../../../generated/prisma';
import type { CreateUserInput, UpdateUserInput, UserWhereInput } from '../../generated/graphql';
import { hashPassword } from '../../utils/auth';
import prisma from '../index';

const userRepository = prisma.user;

export const checkUserExists = async (id: string) => {
    return !!(await userRepository.findUnique({
        where: { id, },
        select: { id: true },
    }));
}

export const checkUserExistsAndIsActive = async (id: string) => {
    return !!(await userRepository.findUnique({
        where: { id, active: true },
        select: { id: true },
    }));
}

export const isEmailTaken = async (email: string) => {
    return !!(await userRepository.findUnique({
        where: { email, },
        select: { id: true },
    }));
}

export const createUser = async (data: CreateUserInput): Promise<User> => {
    if (await isEmailTaken(data.email)) {
        throw new Error('Email already taken');
    }

    const payload: Prisma.UserCreateInput = {
        ...data,
        password: await hashPassword(data.password),
    };

    return await userRepository.create({
        data: payload,
    });
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

    return await userRepository.update({
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

export const findUsers = async (where?: UserWhereInput): Promise<User[]> => {
    const cleaned = {
        active: true,
        AND: where?.AND ?? undefined,
        OR: where?.OR ?? undefined,
        NOT: where?.NOT ?? undefined,
        age: where?.age ?? undefined,
        email: where?.email ?? undefined,
        name: where?.name ?? undefined,
    } as Prisma.UserWhereInput;

    return await prisma.user.findMany({
        where: cleaned,
    });
};