import { defineConfig } from "vite";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      formats: ["es", "cjs"],
      entry: resolve(__dirname, "src/index.ts"),
      name: "markdown-it-conditional-render",
      fileName: "index",
    },
  },
  plugins: [typescript()],
});
