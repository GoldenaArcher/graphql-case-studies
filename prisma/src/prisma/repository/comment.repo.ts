import prisma from '../index';
import type { Comment, Prisma } from '../../../generated/prisma';
import type { CreateCommentInput, UpdateCommentInput } from '../../generated/graphql';
import { checkPostExists, checkPostIsPublished } from './post.repo';
import { checkUserExistsAndIsActive } from './user.repo';

export const getCommentById = async (id: string): Promise<Comment | null> => {
    return await prisma.comment.findUnique({
        where: { id },
    });
};

export const checkCommentExists = async (id: string): Promise<boolean> => {
    return !!(await prisma.comment.findUnique({
        where: { id },
        select: { id: true }
    }))
};

export const findAvailableComments = async (): Promise<Comment[]> => {
    return await prisma.comment.findMany({
        where: { archived: false }
    });
};

export const createComment = async (data: CreateCommentInput): Promise<Comment> => {
    if (!(await checkUserExistsAndIsActive(data.author))) {
        throw new Error('User not found');
    }

    if (!(await checkPostExists(data.post))) {
        throw new Error('Post not found');
    }

    const payload: Prisma.CommentCreateInput = {
        text: data.text,
        archived: false,
        post: {
            connect: {
                id: data.post
            }
        },
        user: {
            connect: {
                id: data.author
            }
        }
    };

    return await prisma.comment.create({
        data: payload
    });
}

export const updateComment = async (id: string, data: UpdateCommentInput): Promise<Comment> => {
    const dbComment = await getCommentById(id);
    if (!dbComment) {
        throw new Error('Comment not found');
    }
    
    if (!(await checkUserExistsAndIsActive(dbComment.userId))) {
        throw new Error('User not found');
    }

    if (!(await checkPostIsPublished(dbComment.postId))) {
        throw new Error('Post not found');
    }

    const payload: Prisma.CommentUpdateInput = {}

    if (data.text) {
        payload.text = data.text;
    }

    return await prisma.comment.update({
        where: { id },
        data: payload
    });
}

export const archiveComment = async (id: string): Promise<Comment> => {
    return await updateComment(id, { archived: true });
}

export const orphanComment = async (id: string): Promise<Comment> => {
    return await updateComment(id, { orphaned: true });
}