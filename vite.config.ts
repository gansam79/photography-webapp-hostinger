import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Import the explicit server entry so Vite resolves the correct module
import { createServer } from "./server/index.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        path.resolve(__dirname, "."),
        path.resolve(__dirname, "./client"),
        path.resolve(__dirname, "./shared"),
        path.resolve(__dirname, "./website"),
        path.resolve(__dirname, "./node_modules"),
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**", "website/node_modules_backup/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin/index.html"),
      },
    },
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@website": path.resolve(__dirname, "./website"),
    },
  },
}));

console.log('Vite config loaded - triggering restart ' + Date.now());
function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // SPA Fallback for /admin
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";
        if (url.startsWith("/admin") && !url.startsWith("/api") && !url.includes(".")) {
          req.url = "/admin/index.html";
        }
        next();
      });

      const app = createServer({ middlewareMode: true });

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
