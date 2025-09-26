import { createPubSub } from "graphql-yoga";
import type { PubSubEvents } from "./type";

export const pubsub = createPubSub<PubSubEvents>();
