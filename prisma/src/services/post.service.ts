import type { Prisma } from "../../generated/prisma";
import type {
    CreatePostInput,
    PostConnection,
    PostWhereInput,
    UpdatePostInput,
    User,
} from "../generated/graphql";
import {
    buildPostConnection,
    mapDBPostToPost,
} from "../graphql/resolvers/post/post.mapper";
import commentRepository from "../prisma/repository/comment.repo";

import postRepository from "../prisma/repository/post.repo";
import userRepository from "../prisma/repository/user.repo";
import { postLogger } from "../utils/logger";
import { buildFindManyArgs } from "../utils/prisma";
import authService from "./auth.service";

const createPost = async (
    data: CreatePostInput,
    user: User | null | undefined,
) => {
    if (!user || !user.id) {
        throw new Error("User not authenticated");
    }

    if (!(await userRepository.checkUserExistsAndIsActive(user.id))) {
        throw new Error("User not found or inactive");
    }

    const payload: Prisma.PostCreateInput = {
        title: data.title,
        body: data.body,
        published: false,
        archived: false,
        user: {
            connect: { id: user.id },
        },
    };

    return mapDBPostToPost(await postRepository.createPost(payload));
};

// alternative option is to create another method called findPostByIdAndUserId
// then there is no need to make so many queries for validation/guards
// this approach is more useful when finer grained control is needed
const updatePost = async (
    id: string,
    data: UpdatePostInput,
    user: User | null | undefined,
) => {
    const retrievedUser = await authService.getUser(user);

    if (!(await authService.checkUserIsAuthenticatedAndActive(retrievedUser))) {
        throw new Error("User not authenticated or inactive");
    }

    const post = await postRepository.findPostById(id);

    if (!post) {
        throw new Error("Post not found");
    }

    if (!authService.checkIsSameUser(retrievedUser, post?.author!)) {
        throw new Error("User not authorized to update this post");
    }

    const payload: Prisma.PostUpdateInput = {};

    if (data.title != null) {
        payload.title = data.title;
    }

    if (data.body != null) {
        payload.body = data.body;
    }

    return mapDBPostToPost(await postRepository.updatePost(id, payload));
};

const archivePost = async (id: string, user: User | null | undefined) => {
    const retrievedUser = await authService.getUser(user);

    if (!(await authService.checkUserIsAuthenticatedAndActive(retrievedUser))) {
        throw new Error("User not authenticated or inactive");
    }

    const post = await postRepository.findPostById(id);

    if (!authService.checkIsSameUser(retrievedUser, post?.author!)) {
        throw new Error("User not authorized to archive this post");
    }

    if (!post || post.archived || !post.published) {
        throw new Error("Post does not exist.");
    }

    const archivedPost = await postRepository.archivePost(id);
    const orphanedCommentCount = await commentRepository.orphanCommentsByPostId(
        id,
    );

    if (orphanedCommentCount !== 0) {
        postLogger.warn(
            { archivePost: id },
            `Orphaned ${orphanedCommentCount} comments for post ${id}`,
        );
    }

    return mapDBPostToPost(archivedPost);
};

const publishPost = async (id: string, user: User | null | undefined) => {
    const retrievedUser = await authService.getUser(user);

    if (!(await authService.checkUserIsAuthenticatedAndActive(retrievedUser))) {
        throw new Error("User not authenticated or inactive");
    }

    const post = await postRepository.findPostById(id);

    if (!authService.checkIsSameUser(retrievedUser, post?.author!)) {
        throw new Error("User not authorized to publish this post");
    }

    if (!post || post.archived || post.published) {
        throw new Error("Post does not exist.");
    }

    return mapDBPostToPost(await postRepository.publishPost(id));
};

const findPostById = async (id: string) => {
    const post = await postRepository.findPostById(id);

    if (!post) {
        throw new Error("Post not found");
    }

    return mapDBPostToPost(post);
};

const findAvailablePosts = async (
    where?: PostWhereInput,
    first?: number | null,
    skip?: number | null,
    after?: string | null,
): Promise<PostConnection> => {
    const cleaned: Prisma.PostWhereInput = {
        published: true,
        archived: false,
    };

    if (where?.title) cleaned.title = { ...where.title } as Prisma.StringFilter;
    if (where?.body) cleaned.body = { ...where.body } as Prisma.StringFilter;

    const args: Prisma.PostFindManyArgs =
        buildFindManyArgs<Prisma.PostFindManyArgs>(cleaned, first, skip, after);

    const [posts, hasNextPage, totalCount] = await Promise.all([
        postRepository.findPosts(args),
        postRepository.hasNextPage(
            after ?? "",
            args.orderBy as Prisma.PostOrderByWithRelationInput[],
            cleaned,
        ),
        postRepository.getTotalCount(cleaned),
    ]);

    return buildPostConnection(posts, after, hasNextPage, totalCount);
};

const checkPostExists = async (id: string) => {
    return !!(await postRepository.findPostById(id));
};

const postService = {
    createPost,
    updatePost,
    archivePost,
    publishPost,
    findPostById,
    findAvailablePosts,
    checkPostExists,
};

export default postService;
