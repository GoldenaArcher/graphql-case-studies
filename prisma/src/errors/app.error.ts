import { GraphQLError } from "graphql";

export class AppError extends GraphQLError {
    public code: string;
    public httpStatus: number;
    public details?: Record<string, any>;
    public domain: string;
    public layer: string;

    constructor(
        message: string,
        code: string,
        httpStatus = 500,
        details?: Record<string, any>,
        domain = "unknown",
        layer = "unknown",
    ) {
        super(message, { extensions: { code, httpStatus, ...details } });
        this.code = code;
        this.httpStatus = httpStatus;
        if (details) this.details = details;
        this.domain = domain;
        this.layer = layer;
    }

    toGraphQLError(requestId?: string): GraphQLError {
        return new GraphQLError(this.message, {
            extensions: {
                code: this.code,
                httpStatus: this.httpStatus,
                requestId,
                domain: this.domain,
                layer: this.layer,
                ...this.details,
            },
        });
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, details?: Record<string, any>) {
        super(`${resource} not found`, "NOT_FOUND", 404, details);
    }
}

export class AuthError extends AppError {
    constructor(message = "Unauthorized", details?: Record<string, any>) {
        super(message, "UNAUTHORIZED", 401, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", details?: Record<string, any>) {
        super(message, "FORBIDDEN", 403, details);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, "BAD_USER_INPUT", 400, details);
    }
}
