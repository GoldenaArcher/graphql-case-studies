import type { Post, Comment } from "../../generated/graphql";
import type { pubsub } from "./pubsub";

export type EventType = "CREATED" | "UPDATED" | "DELETED";
type Entity = "comment" | "post";
type PubSubKey = `${Entity}:${EventType}` | `${Entity}:${EventType}:${string}`;

type EntityMap = {
  comment: Comment;
  post: Post;
};

export type EventPayload<T> = {
  type: EventType;
  data: T;
};

type GlobalPubSubEvents = {
  [K in keyof EntityMap as `${K & string}:${EventType}`]: [
    EventPayload<EntityMap[K]>
  ];
};

type ScopedPubSubEvents = {
  [K in keyof EntityMap as `${K & string}:${EventType}:${string}`]: [
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
};
