import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
  plugins: [
    // Add any necessary Vite plugins here, e.g., for handling Sass, React, etc.
  ],
});
