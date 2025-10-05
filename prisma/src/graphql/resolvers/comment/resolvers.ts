import type { CommentResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

import { mapDBPostToPost } from "../post/post.mapper";

export const commentResolvers: CommentResolvers = {
    async author(parent, _args, context: GraphQLContext) {
        const user = await context.loaders.userByCommentLoader.load(parent.id);
        return user[0]!.value;
    },
    async post(parent, _args, context: GraphQLContext) {
        const post = await context.loaders.postByCommentLoader.load(parent.id);
        return mapDBPostToPost(post[0]!.value);
    },
};
