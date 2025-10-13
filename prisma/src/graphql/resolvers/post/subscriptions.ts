import type { SubscriptionResolvers } from "../../../generated/graphql";
import type { EventPayload, GraphQLContext } from "../../context/type";
import type { Post as DBPost } from "../../../../generated/prisma";

import { postLogger } from "../../../utils/logger";

export const postSubscriptions: Pick<SubscriptionResolvers, "post"> = {
    post: {
        subscribe: (_parent, _args, { pubsub }: GraphQLContext) => {
            postLogger.info({ subscription: "post" }, "Subscribing to post");
            return pubsub.subscribe("post");
        },
        resolve: (payload: EventPayload<DBPost>) => {
            postLogger.info({ payload }, "Resolving post subscription");

            return payload;
        },
    },
};
