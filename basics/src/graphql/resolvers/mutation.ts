import type {
  MutationCreateCommentArgs,
  MutationCreatePostArgs,
  MutationCreateUserArgs,
  MutationResolvers,
  Post,
  User,
} from "../../generated/graphql";

import users from "../../../mock/users.json";
import posts from "../../../mock/posts.json";
import comments from "../../../mock/comments.json";

export const mutationResolvers: MutationResolvers = {
  createUser: (_parent, args: MutationCreateUserArgs) => {
    const isEmailTaken = users.some((user) => user.email === args.email);

    if (isEmailTaken) {
      throw new Error("Email is already taken");
    }

    const newUser = {
      id: crypto.randomUUID(),
      ...args,
    } as User;
    users.push(newUser);
    return newUser;
  },
  createPost: (_parent, args: MutationCreatePostArgs) => {
    const userExists = users.some((user) => user.id === args.author);

    if (!userExists) {
      throw new Error("User not found");
    }

    const newPost = {
      id: crypto.randomUUID(),
      ...args,
    };
    posts.push(newPost);
    return newPost as unknown as Post;
  },
  createComment: (
    _parent,
    { text, author, post }: MutationCreateCommentArgs
  ) => {
    const userExists = users.some((user) => user.id === author);
    const postExists = posts.some((p) => p.id === post && p.published);

    if (!userExists) {
      throw new Error("User not found");
    }
    if (!postExists) {
      throw new Error("Post not found");
    }

    const newComment = {
      id: crypto.randomUUID(),
      text,
      userId: author,
      postId: post,
    };
    comments.push(newComment);
    return newComment as any;
  },
};
