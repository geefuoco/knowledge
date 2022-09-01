import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./setup/setup.ts", "./setup/teardown.ts"],
  bail: true,
  detectOpenHandles: true
};

export default config;
