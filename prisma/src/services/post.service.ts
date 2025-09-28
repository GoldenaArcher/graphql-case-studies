import type { Prisma } from "../../generated/prisma";
import type { CreatePostInput, UpdatePostInput, User } from "../generated/graphql";
import { mapDBPostToPost } from "../graphql/resolvers/post/post.mapper";

import postRepository from "../prisma/repository/post.repo";
import userRepository from "../prisma/repository/user.repo";
import authService from "./auth.service";

const createPost = async (data: CreatePostInput, user: User | null | undefined) => {
    if (!user || !user.id) {
        throw new Error('User not authenticated');
    }

    if (!(await userRepository.checkUserExistsAndIsActive(user.id))) {
        throw new Error('User not found or inactive');
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
}

const updatePost = async (id: string, data: UpdatePostInput, user: User | null | undefined) => {
    if (!(await authService.checkUserIsAuthenticatedAndActive(user))) {
        throw new Error('User not authenticated or inactive');
    }

    const post = await postRepository.findPostById(id);

    if (!post) {
        throw new Error('Post not found');
    }

    if (post.author !== user!.id) {
        throw new Error('User not authorized to update this post');
    }

    const payload: Prisma.PostUpdateInput = {};

    if (data.title != null) {
        payload.title = data.title;
    }

    if (data.body != null) {
        payload.body = data.body;
    }

    return mapDBPostToPost(await postRepository.updatePost(id, payload));
}

const postService = {
    createPost,
    updatePost,
}

export default postService;