import prisma from '../../db';
import { createBatchLoader } from '../../utils/loadder';

export const commentByUserLoader = () =>
    createBatchLoader(
        async (userIds: readonly string[]) => {
            return prisma.comment.findMany({
                where: {
                    userId: { in: [...userIds] },
                },
            });
        },
        (comment) => comment.userId
    )

export const commentByPostLoader = () =>
    createBatchLoader(
        async (postIds: readonly string[]) => {
            return prisma.comment.findMany({
                where: {
                    postId: { in: [...postIds] },
                },
            });
        },
        (comment) => comment.postId
    )