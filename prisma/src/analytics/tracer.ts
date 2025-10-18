import tracer from "dd-trace";
import { envToBool } from "../utils/env";
import { logger } from "../utils/logger";

const { DD_TRACE_ENABLED, OTLP_ENABLED } = process.env;

const isDatadogEnabled = envToBool(DD_TRACE_ENABLED, true);

if (isDatadogEnabled) {
    tracer.init({
        logInjection: true,
        service: "graphql-service",
        hostname: "127.0.0.1",
        port: 8126,
        logLevel: "debug",
    });
    logger.info("Datadog tracing enabled.");
    if (envToBool(OTLP_ENABLED)) {
    }

    tracer.use("http", {
        blocklist: ["/health", "/status"],
        splitByDomain: true,
    });
} else {
    console.warn("Datadog tracing disabled.");
}

const span = tracer.startSpan("manual.test.span");
setTimeout(() => {
    span.finish();
    logger.info("Finished test span");
}, 500);

export default tracer;
