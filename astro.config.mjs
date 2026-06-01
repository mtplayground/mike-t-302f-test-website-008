import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  server: {
    host: "0.0.0.0",
    port: 8080
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
