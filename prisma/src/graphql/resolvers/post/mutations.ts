import type {
  MutationCreatePostArgs,
  MutationDeletePostArgs,
  MutationResolvers,
  MutationUpdatePostArgs,
  Post,
} from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import posts, { archivePost, updatePost } from "./data";
import users from "../user/data";

import { postLogger } from "../../../utils/logger";

export const postMutations: Pick<
  MutationResolvers,
  "createPost" | "deletePost" | "updatePost"
> = {
  createPost: (
    _parent,
    { data }: MutationCreatePostArgs,
    { pubsub }: GraphQLContext
  ) => {
    const userExists = users.some((user) => user.id === data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const newPost = {
      id: crypto.randomUUID(),
      ...data,
      archived: false,
      published: true,
    };
    posts.push(newPost);

    postLogger.info({ post: newPost }, "Post created");

    pubsub.publish(`post:CREATED`, {
      type: `CREATED`,
      data: newPost as unknown as Post,
    });

    postLogger.info(
      {
        createdPost: {
          type: `CREATED`,
          data: newPost as unknown as Post,
        },
      },
      "Publishing to post:CREATED"
    );

    return newPost as unknown as Post;
  },
  deletePost: (
    _parent,
    { id }: MutationDeletePostArgs,
    { pubsub }: GraphQLContext
  ) => {
    const archivedPost = archivePost(id);

    postLogger.info({ post: archivedPost }, "Post archived");

    pubsub.publish(`post:DELETED`, {
      type: `DELETED`,
      data: archivedPost as unknown as Post,
    });

    postLogger.info(
      {
        deletedPost: {
          type: `DELETED`,
          data: archivedPost as unknown as Post,
        },
      },
      "Publishing to post:DELETED"
    );

    return true;
  },
  updatePost: (
    _parent,
    { id, data }: MutationUpdatePostArgs,
    { pubsub }: GraphQLContext
  ) => {
    const updatedPost = updatePost(id, data) as unknown as Post;

    postLogger.info({ post: updatedPost }, "Post updated");

    pubsub.publish(`post:UPDATED`, {
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
};
