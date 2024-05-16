import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["app/unitTests/*.test.ts"],
  },
  resolve: {
    alias: {
      lib: "/app/node_modules",
    },
  },
});
