import type { YogaInitialContext } from "graphql-yoga";
import type { Post, Comment, EventType, User } from "../../generated/graphql";
import type { createLoaders } from "../loaders";
import type { pubsub } from "./pubsub";

export type EntityMap = {
  comment: Comment;
  post: Post;
};

export type EventPayload<T> = {
  type: EventType;
  data: T;
};

type GlobalPubSubEvents = {
  [K in keyof EntityMap]: [EventPayload<EntityMap[K]>];
};

type ScopedPubSubEvents = {
  [K in keyof EntityMap as `${K & string}:${string}`]: [
    EventPayload<EntityMap[K]>
  ];
};

export type PubSubEvents = {
  count: [number];
} & GlobalPubSubEvents &
  ScopedPubSubEvents;

export type GraphQLContext = {
  pubsub: typeof pubsub;
  requestId?: string;
  loaders: ReturnType<typeof createLoaders>;
  user?: User | null;
} & YogaInitialContext;
