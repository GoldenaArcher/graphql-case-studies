import type { Post, SubscriptionResolvers } from "../../../generated/graphql";
import { postLogger } from "../../../utils/logger";
import type { EventPayload, GraphQLContext } from "../../context/type";

export const postSubscriptions: Pick<SubscriptionResolvers, "post"> = {
  post: {
    subscribe: (_parent, _args, { pubsub }: GraphQLContext) => {
      postLogger.info({ subscription: "post" }, "Subscribing to post");
      return pubsub.subscribe("post");
    },
    resolve: (payload: EventPayload<Post>) => {
      postLogger.info({ payload }, "Resolving post subscription");

      return payload;
    },
  },
};
