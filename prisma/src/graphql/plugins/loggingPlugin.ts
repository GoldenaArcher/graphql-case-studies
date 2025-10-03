import type {
    DefinitionNode,
    DocumentNode,
    OperationDefinitionNode,
} from "graphql";
import { isAsyncIterable, type Plugin } from "graphql-yoga";
import type { Logger } from "pino";
import type { GraphQLContext } from "../context/type";
import { asyncStore } from "../../tracing/asyncStore";

export function createRequestLoggerPlugin(
    logger: Logger,
): Plugin<GraphQLContext> {
    return {
        onExecute({ args, setExecuteFn, executeFn }) {
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

            logger.info(
                {
                    operationName: opName,
                    requestId,
                    querySummary,
                    operationType,
                    rootFields,
                    variables,
                },
                `GraphQL ${operationType ?? "operation"}: ${opName} (${
                    rootFields?.join(", ") || "unknown"
                })`,
            );

            setExecuteFn(async (execArgs) => {
                return asyncStore.run(
                    {
                        requestId: requestId!,
                        userId: user?.id ?? undefined,
                        operationName: args.operationName ?? "Anonymous",
                    },
                    async () => {
                        return executeFn(execArgs);
                    },
                );
            });
        },
        async onExecutionResult({ result, context }) {
            const ctx = context as GraphQLContext;
            const requestId = ctx.requestId;

            if (isAsyncIterable(result)) {
                for await (const singleResult of result) {
                    if (singleResult.errors) {
                        logger.error(
                            {
                                requestId: ctx.requestId,
                                errors: singleResult.errors,
                            },
                            `GraphQL subscription errored`,
                        );
                    }
                }
            } else {
                if (result?.errors) {
                    logger.error(
                        { requestId: ctx.requestId, errors: result.errors },
                        `GraphQL execution resulted in errors`,
                    );
                } else {
                    logger.info(
                        { requestId: ctx.requestId },
                        `GraphQL execution completed successfully`,
                    );
                }
            }
        },
    };
}
