import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: "index",
      fileName: (format: string) => `index.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["cac", "chalk", "path", "fs", "url", "execa", "prompts"],
    },
  },
  plugins: [
    // @ts-ignore
    dts({
      outputDir: ["dist/types"],
    }),
  ],
});
