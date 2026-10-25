import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/js/index.jsx", "resources/js/admin/main.jsx"],
      refresh: true,
    }),
    react(),
  ],
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
