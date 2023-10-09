import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
      },
    },
    esbuild: {
      loader: "tsx",
      include: [
        "../react/src/**/*.tsx",
        "../react/src/**/*.ts",
        "../react/src/**/*.jsx",
        "../react/src/**/*.js",
        "src/**/*.jsx",
      ],
    },
    build: {
      outDir: "sdk",
      lib: {
        entry: resolve(__dirname, "src/main.jsx"),
        name: "index",
        fileName: "index",
      },
    },
    define: {
      ...(mode === "production"
        ? {
            "process.env.NODE_ENV": JSON.stringify("development"),
          }
        : {}),
    },
    server: {
      port: 3000,
      open: true,
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
