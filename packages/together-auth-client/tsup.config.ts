import { defineConfig } from "tsup";

export default defineConfig([
  // Client bundle — React, hooks, components
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "next"],
    banner: { js: '"use client";' },
    esbuildOptions(opts) {
      opts.conditions = ["browser"];
    },
  },
  // Server bundle — server components + getServerSession
  {
    entry: { server: "src/server.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    external: ["react", "react-dom", "next"],
    esbuildOptions(opts) {
      opts.conditions = ["node"];
    },
  },
]);
