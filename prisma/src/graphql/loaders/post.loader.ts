import prisma from '../../prisma';
import { createBatchLoader } from '../../utils/loadder';

export const postByUserLoader = () =>
    createBatchLoader(
        async (userIds: readonly string[]) => {
            return prisma.post.findMany({
                where: { author: { in: [...userIds] } },
            });
        },
        (post) => post.author
    );

export const postByCommentLoader = () =>
    createBatchLoader(
        async (commentIds: readonly string[]) => {
            return await prisma.post.findMany({
                where: { author: { in: [...commentIds] } },
            });
        },
        (post) => post.id
    );