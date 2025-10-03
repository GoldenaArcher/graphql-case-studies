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

                        if (result instanceof Promise) {
                            return result.catch((err: any) => {
                                scopedLogger.error(
                                    {
                                        requestId: trace?.requestId,
                                        userId: trace?.userId,
                                        method: String(prop),
                                        err,
                                    },
                                    `${domain}.${layer}.${String(prop)} failed`,
                                );
                                throw err;
                            });
                        }

                        return result;
                    } catch (err) {
                        if (err instanceof AppError) {
                            scopedLogger.error(
                                {
                                    requestId: trace?.requestId,
                                    userId: trace?.userId,
                                    method: String(prop),
                                    code: err.code,
                                    details: err.details,
                                },
                                `${domain}.${layer}.${String(prop)} failed: ${
                                    err.message
                                }`,
                            );
                            throw err;
                        }

                        if (err instanceof Error) {
                            const wrapped = new AppError(
                                err.message || "Unexpected error",
                                "INTERNAL_ERROR",
                                500,
                                { originalError: err, domain, layer },
                            );
                            scopedLogger.error(
                                { err },
                                `Unhandled error in ${String(prop)}`,
                            );
                            throw wrapped;
                        }

                        const wrapped = new AppError(
                            "Unknown error",
                            "INTERNAL_ERROR",
                            500,
                            { originalError: String(err), domain, layer },
                        );
                        scopedLogger.error({ err }, "Non-Error thrown");
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
