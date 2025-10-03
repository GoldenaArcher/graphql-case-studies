import { pubsub } from "../context/pubsub";

export function startMockCountPublisher() {
  let count = 0;

  setInterval(() => {
    pubsub.publish("count", count++);
    console.log(`[MockPubSub] published count: ${count}`);
  }, 1000);
}
