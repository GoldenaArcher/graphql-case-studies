import type { UserResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context/type";

export const userResolvers: UserResolvers = {
    async posts(parent, _args, context: GraphQLContext) {
        const posts = await context.loaders.postByUserLoader.load(parent.id);
        return posts;
    },
    async comments(parent, _args, context: GraphQLContext) {
        const comments = await context.loaders.commentByUserLoader.load(
            parent.id,
        );
        return comments;
    },
};
