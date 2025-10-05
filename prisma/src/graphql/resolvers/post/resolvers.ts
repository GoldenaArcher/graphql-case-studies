import type { PostResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import { mapDBCommentToComment } from "../comment/comment.mapper";

export const postResolvers: PostResolvers = {
  async comments(parent, _args, context: GraphQLContext) {
    const comments = await context.loaders.commentByPostLoader.load(parent.id);
    return comments.map(comment => mapDBCommentToComment(comment));
  },
  async author(parent, _args, context: GraphQLContext) {
    const user = await context.loaders.userByPostLoader.load(parent.id);
    return user[0]!.value;
  },
};
