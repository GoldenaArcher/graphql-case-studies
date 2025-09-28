import jwt from 'jsonwebtoken';

import type { Prisma } from '../../generated/prisma';
import type { LoginInput, RegisterInput, UpdateUserInput, User } from '../generated/graphql';

import { comparePassword, hashPassword } from '../utils/auth';
import userRepository from '../prisma/repository/user.repo';
import { mapDBUserToUser } from '../graphql/resolvers/user/user.mappers';

import { logger } from '../utils/logger';

const register = async (data: RegisterInput) => {
    const user = await userRepository.findUserByEmail(data.email);
    if (user) throw new Error('Email already taken');

    const hashedPassword = await hashPassword(data.password);

    const newUser = await userRepository.createUser({
        ...data,
        password: hashedPassword,
    });

    return {
        user: mapDBUserToUser(newUser),
        token: generateToken(newUser.id),
    };
};

const login = async (data: LoginInput) => {
    const user = await userRepository.findUserByEmail(data.email);
    if (!user) throw new Error('Invalid email or password');

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    return {
        user: mapDBUserToUser(user),
        token: generateToken(user.id)
    };
};

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });
};

const verifyToken = (token: string, requestId: string) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        return payload.userId;
    } catch (err) {
        let errMsg = `${requestId} \n`
        if (err instanceof jwt.JsonWebTokenError) {
            errMsg += err.message;
            logger.error({ requestId }, errMsg);
            throw new Error("Invalid token");
        } else if (err instanceof Error) {
            errMsg += err.message;
            logger.error({ requestId }, errMsg);
            throw err;
        } else {
            errMsg += String(err);
            logger.error({ requestId }, errMsg);
            throw new Error("Unknown error");
        }
    }
}

const checkUserIsAuthenticatedAndActive = async (user: User | string | null | undefined) => {
    if (!user) {
        return false;
    }

    if (typeof user === 'string' && !(await userRepository.checkUserExistsAndIsActive(user))) {
        return false;
    }

    return !!(user as User).id;
}

const checkIsSameUser = (user: User | null | undefined | string, id: string) => {
    if (typeof user === 'string') {
        return user === id;
    }

    return user && user.id === id;
}

const activateUser = async (id: string, user: User | null | undefined) => {
    const dbUser = await userRepository.findUserById(id);

    if (!dbUser) {
        throw new Error('User not found');
    }

    if (dbUser.active) {
        throw new Error('User already active');
    }

    if (!checkIsSameUser(user, id)) {
        throw new Error('User not authorized to activate this user');
    }

    return await userRepository.activateUser(id);
}

const deactivateUser = async (id: string, user: User | null | undefined) => {
    const dbUser = await userRepository.findUserById(id);

    if (!dbUser) {
        throw new Error('User not found');
    }

    if (!dbUser.active) {
        throw new Error('User already inactive');
    }

    if (!checkIsSameUser(user, id)) {
        throw new Error('User not authorized to deactivate this user');
    }

    return await userRepository.deactivateUser(id);
}

const updateUser = async (id: string, data: UpdateUserInput, user: User | null | undefined) => {
    const dbUser = await userRepository.findUserById(id);
    if (!dbUser) {
        throw new Error('User not found');
    }

    if (!checkIsSameUser(user, id)) {
        throw new Error('User not authorized to update this user');
    }

    const payload: Prisma.UserUpdateInput = {};

    if (data.name != null) {
        payload.name = data.name;
    }

    if (data.email != null) {
        payload.email = data.email;
    }

    return await userRepository.updateUser(id, payload);
}

const authService = {
    register,
    login,
    generateToken,
    verifyToken,
    checkUserIsAuthenticatedAndActive,
    checkIsSameUser,
    activateUser,
    deactivateUser,
    updateUser,
}

export default authService;
