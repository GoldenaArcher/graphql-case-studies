import type { User } from '../../../generated/graphql';
import type { User as DbUser } from '../../../../generated/prisma';

export const mapNewUserToUser = (data: DbUser): User => {
    return {
        ...data,
        posts: [],
        comments: []
    }
}
