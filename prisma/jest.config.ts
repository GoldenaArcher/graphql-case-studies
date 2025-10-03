import dotenv from "dotenv";
import { createDefaultPreset } from "ts-jest";

dotenv.config({ path: "./test.env" });

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
};
