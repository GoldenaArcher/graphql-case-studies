import http from "http";
import { createYoga } from "graphql-yoga";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";

import { schema } from "./graphql/schema";
// import { startMockCountPublisher } from "./graphql/pubsub/startMockCountPublisher";

import type { GraphQLContext } from "./graphql/context/type";
import context from "./graphql/context";

import { logger } from "./utils/logger";
import { createRequestLoggerPlugin } from "./graphql/plugins/loggingPlugin";

const yogaApp = createYoga<GraphQLContext>({
  schema,
  graphqlEndpoint: "/graphql",
  context,
  graphiql: {
    // Use WebSockets in GraphiQL
    subscriptionsProtocol: "WS",
  },
  logging: {
    debug: (msg) => logger.debug(msg),
    info: (msg) => logger.info(msg),
    warn: (msg) => logger.warn(msg),
    error: (msg) => logger.error(msg),
  },
  plugins: [
    createRequestLoggerPlugin(logger),
  ],
});

const httpServer = http.createServer(yogaApp);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: yogaApp.graphqlEndpoint,
});

useServer(
  {
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx: any, _id: string, params: any) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params,
        });

      const args = {
        schema,
        operationName: params.operationName,
        document: parse(params.query),
        variableValues: params.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer
);

const port = Number(process.env.PORT) || 4000;
httpServer.listen(port, () => {
  logger.info(`🚀 Yoga ready at http://localhost:${port}/graphql`);
});

// startMockCountPublisher();
