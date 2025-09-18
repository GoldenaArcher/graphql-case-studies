import http from "http";
import { createSchema, createYoga } from "graphql-yoga";

import users from "../mock/users.json";
import posts from "../mock/posts.json";
import comments from "../mock/comments.json";

type Context = {};

const typeDefs = /* GraphQL */ `
  type Query {
    me: User!
    users(query: String): [User]!
    post: Post!
    posts(query: String): [Post]!
    comments: [Comment]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

const resolvers = {
  Query: {
    // args are: parent, args, context, info
    me: () => ({
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      age: 30,
    }),
    users: (_parent: unknown, { query }: { query?: string }) => {
      if (!query) return users;
      return users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    post: () => ({
      id: "1",
      title: "My first post",
      body: "Hello world!",
      published: true,
    }),
    posts: (_parent: unknown, { query }: { query?: string }) => {
      if (!query) return posts;
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );
    },
    comments: () => {
      return comments;
    },
  },
  Post: {
    author(parent: { author: string }) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent: { id: string }) {
      return comments.filter((comment) => comment.postId === parent.id);
    },
  },
  User: {
    posts(parent: { id: string }) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent: { id: string }) {
      return comments.filter((comment) => comment.userId === parent.id);
    }
  },
  Comment: {
    author(parent: { userId: string }) {
      return users.find((user) => user.id === parent.userId);
    },
    post(parent: { postId: string }) {
      return posts.find((post) => post.id === parent.postId);
    },
  },
};

const schema = createSchema<Context>({
  typeDefs,
  resolvers,
});

const yoga = createYoga<Context>({
  schema,
  graphqlEndpoint: "/graphql",
  context: ({ request }): Context => ({}),
  logging: "debug",
});

const server = http.createServer(yoga);
const port = Number(process.env.PORT) || 4000;
server.listen(port, () => {
  console.log(`🚀 Yoga ready at http://localhost:${port}/graphql`);
});
