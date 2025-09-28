import type { Post, Prisma } from '../../../generated/prisma';
import type { CreatePostInput, PostWhereInput, UpdatePostInput } from '../../generated/graphql';
import prisma from '../index';
import { orphanComment } from './comment.repo';
import { checkUserExistsAndIsActive } from './user.repo';

const repo = prisma.post;

export const checkPostExists = async (postId: string) => {
    return !!(await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
    }));
}

export const checkPostIsPublished = async (postId: string) => {
    return !!(await prisma.post.findUnique({
        where: { id: postId },
        select: { published: true },
    }));
}

export const findPostById = async (postId: string): Promise<Post> => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new Error('Post not found');
    }

    return post;
}

export const findPosts = async (where?: PostWhereInput): Promise<Post[]> => {
    const cleaned = {
        published: true,
        ...(where && {
            title: where.title?.contains ?? undefined,
            body: where.body?.contains ?? undefined,
            published: where.published ?? undefined,
            archive: where.archive ?? undefined,
            AND: where.AND ?? undefined,
            OR: where.OR ?? undefined,
            NOT: where.NOT ?? undefined,
        }),
    } as Prisma.PostWhereInput;

    return await prisma.post.findMany({
        where: cleaned,
    });
}

const createPost = async (data: Prisma.PostCreateInput): Promise<Post> => {
    return await repo.create({ data });
}

export const updatePost = async (postId: string, data: Prisma.PostUpdateInput): Promise<Post> => {
    if (!(await checkPostExists(postId))) {
        throw new Error('Post not found');
    }

    return await prisma.post.update({
        where: { id: postId },
        data,
    });
}

export const archivePost = async (postId: string): Promise<Post> => {
    const post = await findPostById(postId);

    if (!post || post.archived || !post.published) {
        throw new Error('Post does not exist.');
    }

    const archivedPost = await updatePost(postId, { archived: true });
    await orphanComment(postId);

    return archivedPost;
}

export const publishPost = async (postId: string): Promise<Post> => {
    return updatePost(postId, { published: true });
}

const postRepository = {
    checkPostExists,
    checkPostIsPublished,
    findPostById,
    findPosts,
    createPost,
    updatePost,
    archivePost,
    publishPost,
}

export default postRepository;