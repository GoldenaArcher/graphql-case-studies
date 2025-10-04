import type { UserResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";
import { mapDBCommentToComment } from "../comment/comment.mapper";
import { mapDBPostToPost } from "../post/post.mapper";

export const userResolvers: UserResolvers = {
  async posts(parent, _args, context: GraphQLContext) {
    const posts = await context.loaders.postByUserLoader.load(parent.id);
    return posts.map(mapDBPostToPost);
  },
  async comments(parent, _args, context: GraphQLContext) {
    const comments = await context.loaders.commentByUserLoader.load(parent.id);
    return comments.map(comment => mapDBCommentToComment(comment));
  },
};
