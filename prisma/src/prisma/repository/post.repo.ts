import type { Post, Prisma } from '../../../generated/prisma';
import type { CreatePostInput, PostWhereInput, UpdatePostInput } from '../../generated/graphql';
import prisma from '../index';
import { orphanComment } from './comment.repo';
import { checkUserExistsAndIsActive } from './user.repo';

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
    const post = await findPostById(postId);

    if (!post || post.archived || !post.published) {
        throw new Error('Post does not exist.');
    }

    const archivedPost = await updatePost(postId, { archive: true });
    await orphanComment(postId);

    return archivedPost;
}

export const publishPost = async (postId: string): Promise<Post> => {
    return updatePost(postId, { published: true });
}
