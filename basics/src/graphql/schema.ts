import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { resolvers } from "./resolvers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = readFileSync(
  path.join(__dirname, "schema/schema.graphql"),
  "utf-8"
);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers,
});
