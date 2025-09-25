import type { PubSub } from "graphql-yoga";

type EventType = "CREATED" | "UPDATED" | "DELETED";

export function subscribeToEntityEvents<T>(
  pubsub: PubSub<any>,
  entity: string, // e.g. "comment"
  id: string | undefined, // optional ID
  types: EventType[] = ["CREATED", "UPDATED", "DELETED"]
): AsyncIterableIterator<{ type: EventType; data: T }> {
  const topics = types.map((t) =>
    id ? `${entity}:${t}:${id}` : `${entity}:${t}`
  );

  return (async function* () {
    const iters = topics.map((t) => pubsub.subscribe(t));

    while (true) {
      const results = await Promise.race(
        iters.map((it) => it.next().then((res) => ({ ...res, it })))
      );

      if (results.done) {
        break;
      }

      yield results.value;
    }
  })();
}
