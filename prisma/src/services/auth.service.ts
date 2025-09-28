import jwt from 'jsonwebtoken';

import { comparePassword, hashPassword } from '../utils/auth';
import userRepository from '../prisma/repository/user.repo';
import { mapDBUserToUser } from '../graphql/resolvers/user/user.mappers';
import type { RegisterInput } from '../generated/graphql';

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

const login = async (email: string, password: string) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    return {
        user,
        token: generateToken(user.id)
    };
};

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });
};

const authService = {
    register,
    login,
    generateToken,
}

export default authService;
