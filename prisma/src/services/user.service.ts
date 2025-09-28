import type { Prisma } from "../../generated/prisma";
import type { UserWhereInput } from "../generated/graphql";

import { mapDBUserToUser } from "../graphql/resolvers/user/user.mappers";
import userRepository from "../prisma/repository/user.repo";

const findById = async (id: string) => {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error("User not found");
    return mapDBUserToUser(user);
}

export const findActiveUsers = async (where?: UserWhereInput) => {
    const cleaned: Prisma.UserWhereInput = { active: true };

    if (where?.email) cleaned.email = { ...where.email } as Prisma.StringFilter;
    if (where?.name) cleaned.name = { ...where.name } as Prisma.StringFilter;

    return (await userRepository.findUsers(cleaned)).map(mapDBUserToUser);
}

const userService = {
    findById,
    findActiveUsers,
}

export default userService;