import jwt from 'jsonwebtoken';

import { comparePassword, hashPassword } from '../utils/auth';
import userRepository from '../prisma/repository/user.repo';
import { mapDBUserToUser } from '../graphql/resolvers/user/user.mappers';
import type { LoginInput, RegisterInput } from '../generated/graphql';
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

const authService = {
    register,
    login,
    generateToken,
    verifyToken,
}

export default authService;
