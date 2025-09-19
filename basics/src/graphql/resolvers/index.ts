import users from "../../../mock/users.json";
import posts from "../../../mock/posts.json";
import comments from "../../../mock/comments.json";

import {
  type Post,
  type QueryUsersArgs,
  type Resolvers,
  type User,
} from "../../generated/graphql";

type PostDb = {
  id: string;
  title: string;
  author: string;
};

export const resolvers: Resolvers = {
  Query: {
    // args are: parent, args, context, info
    me: () => ({
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      age: 30,
      posts: [],
      comments: [],
    }),
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
    addUser: (
      _parent,
      args: { name: string; email: string; age?: number | null }
    ) => {
      const isEmailTaken = users.some((user) => user.email === args.email);

      if (isEmailTaken) {
        throw new Error("Email is already taken");
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: args.name,
        email: args.email,
        age: args.age || null,
      } as User;
      users.push(newUser);
      return newUser;
    },
    addPost: (
      _parent,
      args: { title: string; body: string; published: boolean; author: string }
    ) => {
      const userExists = users.some((user) => user.id === args.author);

      if (!userExists) {
        throw new Error("User not found");
      }

      const newPost = {
        id: crypto.randomUUID(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };
      posts.push(newPost);
      return newPost as unknown as Post;
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
