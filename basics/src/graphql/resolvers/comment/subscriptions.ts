import type {
  Comment,
  SubscriptionResolvers,
} from "../../../generated/graphql";
import type { EventPayload, GraphQLContext } from "../../context/type";

import { commentLogger } from "../../../utils/logger";
import { subscribeToEntityEvents } from "../../../utils/pubSub";

import posts from "../post/data";

export const commentSubscriptions: Pick<SubscriptionResolvers, "comment"> = {
  comment: {
    subscribe: (_parent, args, { pubsub }: GraphQLContext) => {
      commentLogger.info({ postId: args.postId }, "Subscribing to comment");
      const post = posts.find((p) => p.id === args.postId && p.published);

      if (!post) {
        throw new Error("Post not found");
      }

      return subscribeToEntityEvents(pubsub, "comment", args.postId, [
        "CREATED",
        "UPDATED",
        "DELETED",
      ]);
    },
    resolve: (payload: EventPayload<Comment>) => {
      commentLogger.info({ payload }, "Resolving comment in subscription");

      return payload;
    },
  },
};
