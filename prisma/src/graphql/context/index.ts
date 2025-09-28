import { randomUUID } from "crypto";
import jwt, { type JwtPayload } from 'jsonwebtoken';

import type { User } from "../../generated/graphql";
import type { GraphQLContext } from "./type";

import { pubsub } from "./pubsub";
import { createLoaders } from "../loaders";
import { logger } from "../../utils/logger";
import userService from "../../services/user.service";
import authService from "../../services/auth.service";

const context = async ({ request }: { request: Request }): Promise<GraphQLContext> => {
    const requestId = randomUUID();
    let user: User | null = null;

    if (request) {
        logger.info({ requestId, url: request.url }, "Incoming HTTP request");
        const { headers } = request;
        const authHeader = headers.get("authorization");
        if (authHeader) {
            const [scheme, token] = authHeader.split(" ");
            if (scheme !== "Bearer" || !token) {
                throw new Error("Invalid auth header format");
            }
            
            const userId = authService.verifyToken(token, requestId);
            user = await userService.findById(userId);
        }
    } else {
        logger.info(
            { requestId },
            "Incoming WS subscription or non-HTTP request"
        );
    }

    return { pubsub, requestId, loaders: createLoaders(), user };
}

export default context;