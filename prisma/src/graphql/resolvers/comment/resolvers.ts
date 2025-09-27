import type { CommentResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import { mapDBPostToPost } from "../post/post.mapper";
import { mapDBUserToUser } from "../user/user.mappers";

export const commentResolvers: CommentResolvers = {
  async author(parent, _args, context: GraphQLContext) {
    const user = await context.loaders.userByCommentLoader.load(parent.id);
    return mapDBUserToUser(user[0]!.value);
  },
  async post(parent, _args, context: GraphQLContext) {
    const post = await context.loaders.postByCommentLoader.load(parent.id);
    return mapDBPostToPost(post[0]!.value);
  },
};
