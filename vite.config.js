import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/js/index.jsx"],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      // Polices et images du thème slick, référencées en relatif dans son SCSS
      "slick-assets": fileURLToPath(
        new URL("./node_modules/slick-carousel/slick", import.meta.url),
      ),
    },
  },
  build: {
    // Cartes de sources envoyées à Sentry puis non publiées
    sourcemap: "hidden",
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["resources/js/**/*.test.{js,jsx}"],
  },
  server: {
    watch: {
      ignored: ["**/storage/framework/views/**"],
    },
  },
});
