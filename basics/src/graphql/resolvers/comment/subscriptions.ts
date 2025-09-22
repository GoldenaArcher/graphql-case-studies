import type {
  Comment,
  SubscriptionResolvers,
} from "../../../generated/graphql";
import type { GraphQLContext } from "../../context";
import posts from "../post/data";

export const commentSubscriptions: Pick<SubscriptionResolvers, "comment"> = {
  comment: {
    subscribe: (_parent, args, { pubsub }: GraphQLContext) => {
      const post = posts.find((p) => p.id === args.postId && p.published);

      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.subscribe(`comment-${post.id}`);
    },
    resolve: (payload: Comment) => {
      return payload;
    },
  },
};
