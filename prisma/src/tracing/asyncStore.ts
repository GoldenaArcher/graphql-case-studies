import { AsyncLocalStorage } from "async_hooks";

export interface TraceContext {
    requestId: string;
    userId?: string | undefined;
    operationName?: string | undefined;
}

export const asyncStore = new AsyncLocalStorage<TraceContext>();

export function getTraceContext(): TraceContext | undefined {
    return asyncStore.getStore();
}
