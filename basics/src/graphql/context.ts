import { createPubSub } from "graphql-yoga";
import type { Post } from "../generated/graphql";

export type PubSubEvents = {
  count: number;
  [key: `comment-${string}`]: Comment;
  post: Post;
};

export const pubsub = createPubSub<{
  count: [number];
  [key: `comment-${string}`]: [Comment];
  post: [Post];
}>();

export type GraphQLContext = {
  pubsub: typeof pubsub;
  requestId?: string;
};
