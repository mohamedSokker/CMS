import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/",
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: "localhost",
    // origin: "http://0.0.0.0:5173",
  },
});

// export default defineConfig({
//   base: "/",
//   plugins: [react()],
//   preview: {
//     port: 8080,
//     strictPort: true,
//   },
//   server: {
//     port: 8080,
//     strictPort: true,
//     host: true,
//     origin: "http://0.0.0.0:8080",
//   },
// });
