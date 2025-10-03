import pino, { type LoggerOptions } from "pino";

export type Layer = "repository" | "service" | "controller";
export type Domain = "user" | "post" | "comment" | "auth";

const options: LoggerOptions = {
    level: process.env.LOG_LEVEL || "info",
    ...(process.env.NODE_ENV === "development"
        ? {
              transport: {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      messageFormat: "[{app}/{service}] {msg}",
                      translateTime: 'UTC:yyyy-mm-dd"T"HH:MM:ss.l"Z"',
                  },
              },
          }
        : {}),
};

export const logger = pino({
    ...options,
    base: { app: "graphql-service" },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
        err: pino.stdSerializers.err,
    },
});

export function getLogger(domain: Domain, layer?: Layer) {
    return logger.child({ domain, layer });
}
