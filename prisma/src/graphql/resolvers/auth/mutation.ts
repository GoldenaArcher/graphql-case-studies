import type { MutationResolvers } from "../../../generated/graphql";

import authService from "../../../services/auth.service";

export const authMutations: Pick<MutationResolvers, 'register' | 'login'> = {
    register: async (_parent, args) => {
        const { data } = args;
        return await authService.register(data)
    },
    login: async (_parent, args) => {
        const { data } = args;
        return await authService.login(data)
    }
}