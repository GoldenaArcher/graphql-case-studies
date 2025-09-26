import type { PostResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import { mapDBCommentToComment } from "../comment/comment.mapper";
import { mapDBUserToUser } from "../user/user.mappers";

export const postResolvers: PostResolvers = {
  async comments(parent, _args, context: GraphQLContext) {
    const comments = await context.loaders.commentByPostLoader.load(parent.id);
    return comments.map(mapDBCommentToComment);
  },
  async author(parent, _args, context: GraphQLContext) {
    const user = await context.loaders.userByPostLoader.load(parent.id);
    return mapDBUserToUser(user[0]!.value);
  },
};
