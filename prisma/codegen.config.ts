import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/graphql/schema/**/*.graphql",
  // documents: ["./src/**/*.graphql"],
  generates: {
    "./src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  config: {
    skipTypename: false,
    enumsAsConst: true,
    useTypeImports: true,
  },
};

export default config;
