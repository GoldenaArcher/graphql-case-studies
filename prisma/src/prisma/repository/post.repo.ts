import type { Post, Prisma } from '../../../generated/prisma';
import prisma from '../index';

const repo = prisma.post;

const checkPostExists = async (postId: string) => {
    return !!(await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
    }));
}

const checkPostIsPublished = async (postId: string) => {
    return !!(await prisma.post.findUnique({
        where: { id: postId },
        select: { published: true },
    }));
}

const findPostById = async (postId: string): Promise<Post | null> => {
    return await prisma.post.findUnique({
        where: { id: postId },
    });
}

const findPosts = async (where: Prisma.PostWhereInput): Promise<Post[]> => {
    return await prisma.post.findMany({ where });
}

const createPost = async (data: Prisma.PostCreateInput): Promise<Post> => {
    return await repo.create({ data });
}

const updatePost = async (postId: string, data: Prisma.PostUpdateInput): Promise<Post> => {
    if (!(await checkPostExists(postId))) {
        throw new Error('Post not found');
    }

    return await prisma.post.update({
        where: { id: postId },
        data,
    });
}

const archivePost = async (postId: string): Promise<Post> => {
    const post = await findPostById(postId);

    if (!post || post.archived || !post.published) {
        throw new Error('Post does not exist.');
    }

    const archivedPost = await updatePost(postId, { archived: true });

    return archivedPost;
}

const publishPost = async (postId: string): Promise<Post> => {
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