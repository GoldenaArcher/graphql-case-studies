import type {
    DefinitionNode,
    DocumentNode,
    OperationDefinitionNode,
} from "graphql";
import { isAsyncIterable, type Plugin } from "graphql-yoga";
import type { ExecuteFunction, TypedExecutionArgs } from "@envelop/types";
import type { GraphQLContext } from "../context/type";

import { asyncStore } from "../../tracing/asyncStore";
import { logger } from "../../utils/logger";

const logExecution = (
    args: TypedExecutionArgs<GraphQLContext>,
    setOpFn: (newExecute: ExecuteFunction) => void,
    OpFn: ExecuteFunction,
    isSubscription = false,
) => {
    const { contextValue } = args;
    const { requestId, user } = contextValue;

    const opName = args.operationName || "Anonymous";
    const document = args.document as DocumentNode;

    const querySummary = document?.definitions
        ?.map((def: DefinitionNode) => def.kind)
        .join(", ");

    const variables = args.variableValues;

    const operationDef = document?.definitions.find(
        (def): def is OperationDefinitionNode =>
            def.kind === "OperationDefinition",
    );

    const operationType = operationDef?.operation; // 'query' | 'mutation' | 'subscription'

    const rootFields = operationDef?.selectionSet.selections
        ?.filter((sel) => sel.kind === "Field")
        .map((sel) => (sel as any).name?.value)
        .filter(Boolean); // e.g., ['posts', 'user']

    const loggerMsg = isSubscription
        ? `GraphQL ${operationType ?? "operation"} Subscription: ${opName} (${
              rootFields?.join(", ") || "unknown"
          })`
        : `GraphQL ${operationType ?? "operation"}: ${opName} (${
              rootFields?.join(", ") || "unknown"
          })`;

    logger.info(
        {
            operationName: opName,
            requestId,
            querySummary,
            operationType,
            rootFields,
            variables,
        },
        loggerMsg,
    );

    setOpFn(async (opArgs) => {
        return asyncStore.run(
            {
                requestId: requestId!,
                userId: user?.id ?? undefined,
                operationName: args.operationName ?? "Anonymous",
            },
            async () => {
                return OpFn(opArgs);
            },
        );
    });
};

export function createRequestLoggerPlugin(): Plugin<GraphQLContext> {
    return {
        onExecute({ args, setExecuteFn, executeFn }) {
            logExecution(args, setExecuteFn, executeFn);
        },
        onSubscribe({ args, setSubscribeFn, subscribeFn }) {
            logExecution(args, setSubscribeFn, subscribeFn, true);
        },
        async onExecutionResult({ result, context }) {
            const ctx = context as GraphQLContext;
            const requestId = ctx.requestId;

            if (isAsyncIterable(result)) {
                for await (const singleResult of result) {
                    if (singleResult.errors) {
                        logger.error(
                            {
                                requestId,
                                errors: singleResult.errors,
                            },
                            `GraphQL subscription errored`,
                        );
                    }
                }
            } else {
                if (result?.errors) {
                    logger.error(
                        { requestId, errors: result.errors },
                        `GraphQL execution resulted in errors`,
                    );
                } else {
                    logger.info(
                        { requestId },
                        `GraphQL execution completed successfully`,
                    );
                }
            }
        },
    };
}
