import type { User } from '../../../generated/graphql';
import type { User as DbUser } from '../../../../generated/prisma';

export const mapDBUserToUser = (data: DbUser): User => {
    return {
        ...data,
        posts: [],
        comments: []
    }
}
