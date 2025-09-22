import { createPubSub } from "graphql-yoga";

export type PubSubEvents = {
  count: number;
  [key: `comment-${string}`]: Comment;
};

export const pubsub = createPubSub<{
  count: [number];
  [key: `comment-${string}`]: [Comment];
}>();

export type GraphQLContext = {
  pubsub: typeof pubsub;
};
