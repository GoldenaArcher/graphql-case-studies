import type { User } from '../../../generated/prisma';
import type { CreateUserInput } from '../../generated/graphql';
import prisma from '../index';

const userRepository = prisma.user;

export const checkUserExist = async (id: string) => {
    return !!(await userRepository.findUnique({
        where: { id, },
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

    return await userRepository.create({
        data,
    });
}