import type {
  Post,
  QueryResolvers,
  QueryUsersArgs,
  User,
} from "../../generated/graphql";

import users from "../../../mock/users.json";
import posts from "../../../mock/posts.json";
import comments from "../../../mock/comments.json";

export const queryResolvers: QueryResolvers = {
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
};
