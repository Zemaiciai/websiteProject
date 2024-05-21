import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["app/unitTests/*.test.ts"],
    coverage: {
      provider: "v8",
    },
  },
  resolve: {
    alias: {
      lib: "/app/node_modules",
    },
  },
});
