import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/graphql/schema/**/*.graphql",
  // documents: ["./src/**/*.graphql"],
  generates: {
    "./src/generated/graphql.ts": {
      config: {
        contextType: '../graphql/context/type#GraphQLContext',
        // mappers: {
        //   User: '../../generated/prisma/index#User',
        //   Post: '../../generated/prisma/index#Post',
        //   Comment: '../../generated/prisma/index#Comment',
        // }
      },
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
