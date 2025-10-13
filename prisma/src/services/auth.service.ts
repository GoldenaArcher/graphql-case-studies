import jwt from "jsonwebtoken";

import type { LoginInput, RegisterInput } from "../generated/graphql";
import type { User as UserModel } from "../../generated/prisma";

import { comparePassword, hashPassword } from "../utils/auth";
import userRepository from "../db/repository/user.repo";

import { logger } from "../utils/logger";

const register = async (data: RegisterInput) => {
    const user = await userRepository.findUserByEmail(data.email);
    if (user) throw new Error("Email already taken");

    const hashedPassword = await hashPassword(data.password);

    const newUser = await userRepository.createUser({
        ...data,
        password: hashedPassword,
    });

    return {
        user: newUser,
        token: generateToken(newUser.id),
    };
};

const login = async (data: LoginInput) => {
    const user = await userRepository.findUserByEmail(data.email);
    if (!user) throw new Error("Invalid email or password");

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) throw new Error("Invalid email or password");

    return {
        user: user,
        token: generateToken(user.id),
    };
};

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });
};

const verifyToken = (token: string, requestId: string) => {
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!,
        ) as jwt.JwtPayload;
        return payload.userId;
    } catch (err) {
        let errMsg = `${requestId} \n`;
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
};

const getUser = async (user: UserModel | string | null | undefined) => {
    if (!user) {
        throw new Error("User not found");
    }

    if (typeof user === "string") {
        const dbUser = await userRepository.findUserById(user);
        if (!dbUser) {
            throw new Error("User not found");
        }

        return dbUser;
    }

    return user;
};

const checkUserIsAuthenticatedAndActive = async (
    user: UserModel | string | null | undefined,
) => {
    if (!user) {
        return false;
    }

    if (
        typeof user === "string" &&
        !(await userRepository.checkUserExistsAndIsActive(user))
    ) {
        return false;
    }

    return !!(user as UserModel).id;
};

const checkIsSameUser = (
    user: UserModel | null | undefined | string,
    id: string,
) => {
    if (typeof user === "string") {
        return user === id;
    }

    return user && user.id === id;
};

const activateUser = async (id: string, user: UserModel | null | undefined) => {
    const dbUser = await userRepository.findUserById(id);

    if (!dbUser) {
        throw new Error("User not found");
    }

    if (dbUser.active) {
        throw new Error("User already active");
    }

    if (!checkIsSameUser(user, id)) {
        throw new Error("User not authorized to activate this user");
    }

    return await userRepository.activateUser(id);
};

const deactivateUser = async (
    id: string,
    user: UserModel | null | undefined,
) => {
    const dbUser = await userRepository.findUserById(id);

    if (!dbUser) {
        throw new Error("User not found");
    }

    if (!dbUser.active) {
        throw new Error("User already inactive");
    }

    if (!checkIsSameUser(user, id)) {
        throw new Error("User not authorized to deactivate this user");
    }

    return await userRepository.deactivateUser(id);
};

const authService = {
    register,
    login,
    generateToken,
    verifyToken,
    getUser,
    checkUserIsAuthenticatedAndActive,
    checkIsSameUser,
    activateUser,
    deactivateUser,
};

export default authService;
