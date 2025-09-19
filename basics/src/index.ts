import http from "http";
import { createYoga } from "graphql-yoga";

import { schema } from "./graphql/schema";

type Context = {};

const yoga = createYoga<Context>({
  schema,
  graphqlEndpoint: "/graphql",
  context: ({ request }): Context => ({}),
  logging: "debug",
});

const server = http.createServer(yoga);
const port = Number(process.env.PORT) || 4000;
server.listen(port, () => {
  console.log(`🚀 Yoga ready at http://localhost:${port}/graphql`);
});
