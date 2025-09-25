import type {
  Comment,
  SubscriptionResolvers,
} from "../../../generated/graphql";
import type { EventPayload, GraphQLContext } from "../../context/type";

import { commentLogger } from "../../../utils/logger";

import posts from "../post/data";

export const commentSubscriptions: Pick<SubscriptionResolvers, "comment"> = {
  comment: {
    subscribe: (_parent, args, { pubsub }: GraphQLContext) => {
      const post = posts.find((p) => p.id === args.postId && p.published);

      if (!post) {
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
