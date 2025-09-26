import DataLoader from 'dataloader';
import prisma from '../../prisma';

export const postLoader = () =>
    new DataLoader(async (userIds: readonly string[]) => {
        const posts = await prisma.post.findMany({
            where: { author: { in: [...userIds] } },
        });
        const postsByUserId: Record<string, typeof posts> = {};
        for (const userId of userIds) postsByUserId[userId] = [];
        for (const post of posts) {
            postsByUserId[post.author]?.push(post);
        }
        return userIds.map((id) => postsByUserId[id] || []);
    });