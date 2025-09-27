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
            const comments = await prisma.comment.findMany({
                where: {
                    id: { in: [...commentIds] },
                },
                include: {
                    post: true,
                },
            });

            return comments
                .filter((comment) => comment.post !== null)
                .map((comment) => ({
                    key: comment.id,
                    value: comment.post!,
                }));
        }
    );