import type {
  Comment,
  SubscriptionResolvers,
} from "../../../generated/graphql";
import type { EventPayload, GraphQLContext } from "../../context/type";

import { commentLogger } from "../../../utils/logger";

import postRepository from "../../../prisma/repository/post.repo";

export const commentSubscriptions: Pick<SubscriptionResolvers, "comment"> = {
  comment: {
    subscribe: async (_parent, args, { pubsub }: GraphQLContext) => {
      const post = await postRepository.findPostById(args.postId);

      if (!post || !post.published) {
        throw new Error("Post not found");
      }

      commentLogger.info(
        { subscription: `comment:${post.id}` },
        "Subscribing to comment"
      );

      return pubsub.subscribe(`comment:${post.id}`);
    },
    resolve: (payload: EventPayload<Comment>) => {
      commentLogger.info({ payload }, "Resolving comment in subscription");

      return payload;
    },
  },
};
