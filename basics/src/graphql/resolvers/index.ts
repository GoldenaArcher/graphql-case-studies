import { type Resolvers } from "../../generated/graphql";

import { userResolvers } from "./user";
import { commentResolvers } from "./comment";
import { postResolvers } from "./post";

import { Query } from "./query";
import { Mutation } from "./mutation";

export const resolvers: Resolvers = {
  // args are: parent, args, context, info
  Query,
  Mutation,
  Post: postResolvers,
  User: userResolvers,
  Comment: commentResolvers,
};
