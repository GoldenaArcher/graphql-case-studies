import DataLoader from 'dataloader';
import prisma from '../../prisma';

export const commentLoader = () =>
    new DataLoader(async (userIds: readonly string[]) => {
        const comments = await prisma.comment.findMany({
            where: {
                userId: { in: [...userIds] },
            },
        });

        const commentMap: Record<string, typeof comments> = {};
        for (const userId of userIds) {
            commentMap[userId] = [];
        }

        for (const comment of comments) {
            if (comment.userId) {
                commentMap[comment.userId]?.push(comment);
            }
        }

        return userIds.map((userId) => commentMap[userId] || []);
    });