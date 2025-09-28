import type {
  MutationCreatePostArgs,
  MutationDeletePostArgs,
  MutationPublishPostArgs,
  MutationResolvers,
  MutationUpdatePostArgs,
} from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import { postLogger } from "../../../utils/logger";

import { archivePost, updatePost, publishPost } from "../../../prisma/repository/post.repo";
import { mapDBPostToPost } from "./post.mapper";
import postService from "../../../services/post.service";

export const postMutations: Pick<
  MutationResolvers,
  "createPost" | "deletePost" | "updatePost" | "publishPost"
> = {
  createPost: async (
    _parent,
    { data }: MutationCreatePostArgs,
    { pubsub, user }: GraphQLContext
  ) => {
    const newPost = await postService.createPost(data, user);

    postLogger.info({ post: newPost }, "Post created");

    pubsub.publish(`post`, {
      type: `CREATED`,
      data: newPost,
    });

    postLogger.info(
      {
        createdPost: {
          type: `CREATED`,
          data: newPost
        },
      },
      "Publishing to post:CREATED"
    );

    return newPost;
  },
  deletePost: async (
    _parent,
    { id }: MutationDeletePostArgs,
    { pubsub }: GraphQLContext
  ) => {
    const dbPost = await archivePost(id);
    const archivedPost = mapDBPostToPost(dbPost);

    postLogger.info({ post: dbPost }, "Post archived");

    pubsub.publish(`post`, {
      type: `DELETED`,
      data: archivedPost,
    });

    postLogger.info(
      {
        deletedPost: {
          type: `DELETED`,
          data: archivedPost
        },
      },
      "Publishing to post:DELETED"
    );

    return true;
  },
  updatePost: async (
    _parent,
    { id, data }: MutationUpdatePostArgs,
    { pubsub, user }: GraphQLContext
  ) => {
    const updatedPost = await postService.updatePost(id, data, user);

    postLogger.info({ post: updatedPost }, "Post updated");

    pubsub.publish(`post`, {
      type: `UPDATED`,
      data: updatedPost,
    });

    postLogger.info(
      {
        updatedPost: {
          type: `UPDATED`,
          data: updatedPost,
        },
      },
      "Publishing to post:UPDATED"
    );

    return updatedPost;
  },
  publishPost: async (
    _parent,
    { id }: MutationPublishPostArgs,
    { pubsub }: GraphQLContext
  ) => {
    const dbPost = await publishPost(id);
    const publishedPost = mapDBPostToPost(dbPost);

    postLogger.info({ post: publishedPost }, "Post published");

    pubsub.publish(`post`, {
      type: `UPDATED`,
      data: publishedPost,
    });

    postLogger.info(
      {
        publishedPost: {
          type: `UPDATED`,
          data: publishedPost,
        },
      },
      "Publishing to post:PUBLISHED"
    );

    return publishedPost;
  },
};
