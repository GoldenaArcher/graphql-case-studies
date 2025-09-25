import type { Post, SubscriptionResolvers } from "../../../generated/graphql";
import { postLogger } from "../../../utils/logger";
import { subscribeToEntityEvents } from "../../../utils/pubSub";
import type { EventPayload, GraphQLContext } from "../../context/type";

export const postSubscriptions: Pick<SubscriptionResolvers, "post"> = {
  post: {
    subscribe: (_parent, _args, { pubsub }: GraphQLContext) => {
      postLogger.info({ post: 'post subscription' }, "Subscribing to post");

      return subscribeToEntityEvents(pubsub, "post", _args.postId, [
        "CREATED",
        "CREATED",
        "UPDATED",
        "DELETED",
      ]);
    },
    resolve: (payload: EventPayload<Post>) => {
      postLogger.info({ post: payload.data }, "Post event received");

      return payload;
    },
  },
};
