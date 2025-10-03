import { type Resolvers } from "../../generated/graphql";

import { Query } from "./query";
import { Mutation } from "./mutation";
import { Subscription } from "./subscription";

import { postResolvers } from "./post/resolvers";
import { userResolvers } from "./user/resolvers";
import { commentResolvers } from "./comment/resolvers";


export const resolvers: Resolvers = {
  // args are: parent, args, context, info
  Query,
  Mutation,
  Subscription,
  Post: postResolvers,
  User: userResolvers,
  Comment: commentResolvers,
};
