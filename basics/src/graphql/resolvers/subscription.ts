import { setTimeout as setTimeout$ } from "node:timers/promises";

import type { SubscriptionResolvers } from "../../generated/graphql";
import type { GraphQLContext } from "../context";

export const Subscription: SubscriptionResolvers<GraphQLContext> = {
  count: {
    subscribe: async function* () {
      let i = 0;
      while (true) {
        await setTimeout$(1000);
        yield { count: i++ };
      }
    },
    // subscribe: (_parent, _args, { pubsub }) => {
    //   return pubsub.subscribe("count");
    // },
    // resolve: (payload: number) => payload,
  },
};
