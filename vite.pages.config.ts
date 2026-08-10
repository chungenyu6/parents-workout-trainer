import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/parents-workout-trainer/",
  plugins: [react()],
  build: {
    outDir: "gh-pages-dist",
    emptyOutDir: true,
  },
});
