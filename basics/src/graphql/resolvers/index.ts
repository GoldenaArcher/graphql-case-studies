import { type Resolvers } from "../../generated/graphql";

import { userResolvers } from "./user";
import { commentResolvers } from "./comment";
import { postResolvers } from "./post";
import { queryResolvers } from "./query";
import { mutationResolvers } from "./mutation";

export const resolvers: Resolvers = {
  // args are: parent, args, context, info
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Post: postResolvers,
  User: userResolvers,
  Comment: commentResolvers,
};
