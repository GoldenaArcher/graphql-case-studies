import users from "../../../mock/users.json";
import posts from "../../../mock/posts.json";
import comments from "../../../mock/comments.json";

import {
  type Comment,
  type MutationCreateCommentArgs,
  type MutationCreatePostArgs,
  type MutationCreateUserArgs,
  type Post,
  type QueryUsersArgs,
  type Resolvers,
  type User,
} from "../../generated/graphql";

export const resolvers: Resolvers = {
  Query: {
    // args are: parent, args, context, info
    me: () =>
      ({
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        age: 30,
      } as User),
    users: (_parent, { query }: Partial<QueryUsersArgs>): User[] => {
      if (!query) return users as User[];
      return users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      ) as User[];
    },
    post: () => ({
      id: "1",
      title: "My first post",
      body: "Hello world!",
      published: true,
      author: {} as User,
      comments: [],
    }),
    posts: (_parent, { query }): Post[] => {
      if (!query) return posts as unknown as Post[];
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      ) as unknown as Post[];
    },
    comments: () => {
      return comments as any;
    },
  },
  Mutation: {
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
      return newComment as unknown as Comment;
    },
  },
  Post: {
    author(parent: any) {
      const authorId = (parent as unknown as { author: string }).author;
      return users.find((user) => user.id === authorId) as any;
    },
    comments(parent: any) {
      return comments.filter((comment) => comment.postId === parent.id) as any;
    },
  },
  User: {
    posts(parent: any) {
      return posts.filter((post) => post.author === parent.id) as any;
    },
    comments(parent: any) {
      return comments.filter((comment) => comment.userId === parent.id) as any;
    },
  },
  Comment: {
    author(parent: any) {
      return users.find((user) => user.id === parent.userId) as any;
    },
    post(parent: any) {
      return posts.find((post) => post.id === parent.postId) as any;
    },
  },
};
