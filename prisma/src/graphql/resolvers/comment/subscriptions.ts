import type { SubscriptionResolvers } from "../../../generated/graphql";
import type { EventPayload, GraphQLContext } from "../../context/type";
import type { Comment as DBComment } from "../../../../generated/prisma";

import { commentLogger } from "../../../utils/logger";

import postRepository from "../../../db/repository/post.repo";
import { NotFoundError } from "../../../errors/app.error";

export const commentSubscriptions: Pick<SubscriptionResolvers, "comment"> = {
    comment: {
        subscribe: async (_parent, args, { pubsub }: GraphQLContext) => {
            const post = await postRepository.findPostById(args.postId);

            if (!post || !post.published) {
                throw new NotFoundError("Post");
            }

            commentLogger.info(
                { subscription: `comment:${post.id}` },
                "Subscribing to comment",
            );

            return pubsub.subscribe(`comment:${post.id}`);
        },
        resolve: (payload: EventPayload<DBComment>) => {
            commentLogger.info(
                { payload },
                "Resolving comment in subscription",
            );

            return payload;
        },
    },
};
