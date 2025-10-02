import prisma from "../index";
import type { Comment, Prisma } from "../../../generated/prisma";

const repo = prisma.comment;

const getCommentById = async (id: string): Promise<Comment | null> => {
    return await prisma.comment.findUnique({
        where: { id },
    });
};

const getNonArchivedComments = async (
    args?: Prisma.CommentFindManyArgs,
): Promise<Comment[]> => {
    return await repo.findMany({
        ...args,
        where: { ...args?.where, archived: false },
    });
};

const createComment = async (
    data: Prisma.CommentCreateInput,
): Promise<Comment> => {
    return await prisma.comment.create({ data });
};

const updateComment = async (
    id: string,
    data: Prisma.CommentUpdateInput,
): Promise<Comment> => {
    return await prisma.comment.update({
        where: { id },
        data,
    });
};

const archiveComment = async (id: string): Promise<Comment> => {
    return await updateComment(id, { archived: true });
};

const orphanCommentsByPostId = async (postId: string): Promise<number> => {
    const result = await prisma.comment.updateMany({
        where: { postId },
        data: { orphaned: true },
    });

    return result.count;
};

const checkCommentExistsAndIsActive = async (id: string): Promise<boolean> => {
    return !!(await prisma.comment.findUnique({
        where: { id, archived: false },
        select: { id: true },
    }));
};

const hasNextPage = async (
    cursorId: string,
    orderBy:
        | Prisma.CommentOrderByWithRelationInput[]
        | Prisma.CommentOrderByWithRelationInput,
    where: Prisma.CommentWhereInput,
): Promise<boolean> => {
    const next = await repo.count({
        where: {
            ...where,
            id: { gt: cursorId },
        },
        orderBy,
    });

    return !!next;
};

const getTotalCount = async (
    where: Prisma.CommentWhereInput,
): Promise<number> => {
    return await repo.count({
        where,
    });
};

const commentRepository = {
    createComment,
    getCommentById,
    getNonArchivedComments,
    updateComment,
    archiveComment,
    orphanCommentsByPostId,
    checkCommentExistsAndIsActive,
    hasNextPage,
    getTotalCount,
};

export default commentRepository;
