import type { PostResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

export const postResolvers: PostResolvers = {
    async comments(parent, _args, context: GraphQLContext) {
        const comments = await context.loaders.commentByPostLoader.load(
            parent.id,
        );
        return comments;
    },
    async author(parent, _args, context: GraphQLContext) {
        const user = await context.loaders.userByPostLoader.load(parent.id);
        return user[0]!.value;
    },
};
