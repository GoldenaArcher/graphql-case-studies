import type { Post, SubscriptionResolvers } from "../../../generated/graphql";
import type { GraphQLContext } from "../../context";

export const postSubscriptions: Pick<SubscriptionResolvers, "post"> = {
  post: {
    subscribe: (_parent, _args, { pubsub }: GraphQLContext) => {
      return pubsub.subscribe(`post`);
    },
    resolve: (payload: Post) => {
      return payload;
    },
  },
};
