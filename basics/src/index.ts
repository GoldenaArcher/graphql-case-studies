import http from "http";
import { createSchema, createYoga } from "graphql-yoga";

type MyContext = { userId: string | null };

const typeDefs = /* GraphQL */ `
  type Query {
  }
`;

const resolvers = {
  Query: {
  },
};

const schema = createSchema<MyContext>({
  typeDefs,
  resolvers,
});

const yoga = createYoga<MyContext>({
  schema,
  graphqlEndpoint: "/graphql",
  context: ({ request }): MyContext => ({
    userId: request.headers.get("x-user-id"),
  }),
});

const server = http.createServer(yoga);
const port = Number(process.env.PORT) || 4000;
server.listen(port, () => {
  console.log(`🚀 Yoga ready at http://localhost:${port}/graphql`);
});
