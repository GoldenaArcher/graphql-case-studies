import type { Prisma } from "../../generated/prisma";
import type {
    UpdateUserInput,
    UserConnection,
    UserWhereInput,
} from "../generated/graphql";
import type { User as UserModel } from "../../generated/prisma";

import { buildUserConnection } from "../graphql/resolvers/user/user.mappers";
import userRepository from "../db/repository/user.repo";
import { buildFindManyArgs } from "../utils/prisma";
import authService from "./auth.service";
import { AuthError, NotFoundError } from "../errors/app.error";

const findById = async (id: string) => {
    const user = await userRepository.findUserById(id);
    if (!user) throw new NotFoundError("User");
    return user;
};

export const findActiveUsers = async (
    where?: UserWhereInput,
    first?: number | null,
    skip?: number | null,
    after?: string | null | undefined,
): Promise<UserConnection> => {
    const cleaned: Prisma.UserWhereInput = { active: true };

    if (where?.email) cleaned.email = { ...where.email } as Prisma.StringFilter;
    if (where?.name) cleaned.name = { ...where.name } as Prisma.StringFilter;

    const args: Prisma.UserFindManyArgs =
        buildFindManyArgs<Prisma.UserFindManyArgs>(cleaned, first, skip, after);

    const [users, hasNextPage, totalCount] = await Promise.all([
        userRepository.findUsers(args),
        userRepository.hasNextPage(
            after ?? "",
            args.orderBy as Prisma.UserOrderByWithRelationInput[],
            cleaned,
        ),
        userRepository.getTotalCount(cleaned),
    ]);

    return buildUserConnection(users, after, hasNextPage, totalCount);
};

const updateUser = async (
    id: string,
    data: UpdateUserInput,
    user: UserModel | null | undefined,
) => {
    const dbUser = await userRepository.findUserById(id);
    if (!dbUser) {
        throw new NotFoundError("User not found");
    }

    if (!authService.checkIsSameUser(user, id)) {
        throw new AuthError("User not authorized to update this user");
    }

    const payload: Prisma.UserUpdateInput = {};

    if (data.name != null) {
        payload.name = data.name;
    }

    if (data.email != null) {
        payload.email = data.email;
    }

    return await userRepository.updateUser(id, payload);
};

const userService = {
    findById,
    findActiveUsers,
    updateUser,
};

export default userService;
