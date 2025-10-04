import prisma from '../../db';
import { createBatchLoader } from "../../utils/loadder";

export const userByPostLoader = () =>
    createBatchLoader(
        async (postIds: readonly string[]) => {
            const posts = await prisma.post.findMany({
                where: { id: { in: postIds as string[] } },
                include: { user: true },
            });

            return posts
                .filter((post) => post.user !== null)
                .map((post) => ({
                    key: post.id,
                    value: post.user!,
                }));
        }
    );

export const userByCommentLoader = () => createBatchLoader(
    async (commentIds: readonly string[]) => {
        const comments = await prisma.comment.findMany({
            where: { id: { in: commentIds as string[] } },
            include: { user: true },
        });

        return comments
            .filter((comment) => comment.user !== null)
            .map((comment) => ({
                key: comment.id,
                value: comment.user!,
            }));
    }
);