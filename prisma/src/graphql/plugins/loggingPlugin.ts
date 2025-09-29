import type {
    DefinitionNode,
    DocumentNode,
    OperationDefinitionNode,
} from 'graphql';
import type { Plugin } from 'graphql-yoga';
import type { Logger } from 'pino';
import type { GraphQLContext } from '../context/type';

export function createRequestLoggerPlugin(logger: Logger): Plugin<GraphQLContext> {
    return {
        onExecute({ args }) {
            const { contextValue } = args;
            const requestId = contextValue.requestId;

            const opName = args.operationName || 'Anonymous';
            const document = args.document as DocumentNode;

            const querySummary = document?.definitions
                ?.map((def: DefinitionNode) => def.kind)
                .join(', ');

            const variables = args.variableValues;

            const operationDef = document?.definitions.find(
                (def): def is OperationDefinitionNode => def.kind === 'OperationDefinition'
            );

            const operationType = operationDef?.operation; // 'query' | 'mutation' | 'subscription'

            const rootFields = operationDef?.selectionSet.selections
                ?.filter(sel => sel.kind === 'Field')
                .map(sel => (sel as any).name?.value)
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
                `GraphQL ${operationType ?? 'operation'}: ${opName} (${rootFields?.join(', ') || 'unknown'})`
            );
        },
    };
}