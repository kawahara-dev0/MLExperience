import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow access from outside (e.g. Docker)
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  envDir: ".",
});
