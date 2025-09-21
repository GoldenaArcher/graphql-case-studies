import { createPubSub, type PubSub } from "graphql-yoga";

export type PubSubEvents = {
  count: number;
};

export const pubsub = createPubSub<{
  count: [number];
}>();

export type GraphQLContext = {
  pubsub: typeof pubsub;
};
