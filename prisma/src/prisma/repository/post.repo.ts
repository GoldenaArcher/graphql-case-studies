import type { Post, Prisma } from '../../../generated/prisma';
import type { CreatePostInput, UpdatePostInput } from '../../generated/graphql';
import prisma from '../index';
import { checkUserExistsAndIsActive } from './user.repo';

export const checkPostExists = async (postId: string) => {
    return !!(await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
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

export const findPosts = async (query?: string): Promise<Post[]> => {
    return await prisma.post.findMany({
        where: {
            published: true,
            ...(query && {
                title: {
                    contains: query,
                },
            }),
        },
    });
}

export const createPost = async (data: CreatePostInput): Promise<Post> => {
    if (!(await checkUserExistsAndIsActive(data.author))) {
        throw new Error('User not found or inactive');
    }

    const payload: Prisma.PostCreateInput = {
        title: data.title,
        body: data.body,
        published: false,
        archived: false,
        user: {
            connect: { id: data.author }
        }
    };

    return await prisma.post.create({
        data: payload
    });
}

export const updatePost = async (postId: string, data: UpdatePostInput): Promise<Post> => {
    if (!(await checkPostExists(postId))) {
        throw new Error('Post not found');
    }

    const payload: Prisma.PostUpdateInput = {};

    if (data.title != null) {
        payload.title = data.title;
    }

    if (data.body != null) {
        payload.body = data.body;
    }

    if (data.published != null) {
        payload.published = data.published;
    }

    return await prisma.post.update({
        where: { id: postId },
        data: payload,
    });
}

export const archivePost = async (postId: string): Promise<Post> => {
    return updatePost(postId, { archive: true });
}

export const publishPost = async (postId: string): Promise<Post> => {
    return updatePost(postId, { published: true });
}
