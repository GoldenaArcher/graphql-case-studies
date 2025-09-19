import { fileURLToPath } from "url";
import path from "path";

import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { resolvers } from "./resolvers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typesArray = loadFilesSync(path.join(__dirname, "./**/*.graphql"));

export const typeDefs = mergeTypeDefs(typesArray);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers,
});
