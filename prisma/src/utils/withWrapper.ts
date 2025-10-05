import { getLogger, type Domain, type Layer } from "./logger";
import { getTraceContext } from "../tracing/asyncStore";
import { AppError } from "../errors/app.error";

export function withWrapper<T extends object>(
    target: T,
    domain: Domain,
    layer: Layer,
): T {
    const scopedLogger = getLogger(domain, layer);

    return new Proxy(target, {
        get(obj, prop, receiver) {
            const orig = Reflect.get(obj, prop, receiver);

            if (typeof orig === "function") {
                return (...args: any[]) => {
                    const trace = getTraceContext();
                    const filterredArgs = args.filter((arg) => !!arg);

                    const start = performance.now();

                    scopedLogger.info(
                        {
                            requestId: trace?.requestId,
                            userId: trace?.userId,
                            method: String(prop),
                            args: filterredArgs,
                        },
                        `${domain}.${layer}.${String(prop)}`,
                    );

                    try {
                        const result = orig.apply(obj, args);
                        const duration = performance.now() - start;

                        scopedLogger.info(
                            {
                                requestId: trace?.requestId,
                                userId: trace?.userId,
                                method: String(prop),
                                duration: `${duration.toFixed(2)}ms`,
                            },
                            `${domain}.${layer}.${String(prop)} succeeded`,
                        );

                        return result;
                    } catch (err) {
                        const duration = performance.now() - start;
                        const durationMsg = `${duration.toFixed(2)}ms`;

                        if (err instanceof AppError) {
                            scopedLogger.error(
                                {
                                    requestId: trace?.requestId,
                                    userId: trace?.userId,
                                    method: String(prop),
                                    code: err.code,
                                    details: err.details,
                                    domain: err.domain,
                                    layer: err.layer,
                                    httpStatus: err.httpStatus,
                                    duration: durationMsg,
                                },
                                `${domain}.${layer}.${String(prop)} failed: ${
                                    err.message
                                }`,
                            );
                            throw err;
                        }

                        const wrapped = new AppError(
                            err instanceof Error
                                ? err.message
                                : "Unknown error",
                            "INTERNAL_ERROR",
                            500,
                            {
                                originalError: err,
                                domain,
                                layer,
                            },
                        );

                        scopedLogger.error(
                            { error: err, duration: durationMsg },
                            `Unhandled error in ${String(prop)}`,
                        );

                        throw wrapped;
                    }
                };
            }

            return orig;
        },
    });
}

export function withRepoWrapper<T extends object>(
    target: T,
    domain: Domain,
): T {
    return withWrapper(target, domain, "repository");
}

export function withServiceWrapper<T extends object>(
    target: T,
    domain: Domain,
): T {
    return withWrapper(target, domain, "service");
}
