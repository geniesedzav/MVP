import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from "vite-plugin-mkcert";
import { resolve } from "path";

// ✅ ДИНАМИЧЕСКИЙ ИМПОРТ КОНФИГУРАЦИИ (ES модули)
const loadConfig = async () => {
  const { default: config } = await import("../config/env.js");
  return config;
};

export default defineConfig(async () => {
  const config = await loadConfig();

  return {
    plugins: [vue(), mkcert()],

    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },

    server: {
      host: "0.0.0.0",
      port: config.client.port,
      https: false,
      strictPort: true,

      proxy: {
        "/api": {
          target: config.server.host,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },

    define: {
      "import.meta.env.VITE_API_BASE": JSON.stringify(
        `${config.server.publicUrl}${config.server.apiBase}`
      ),
      "import.meta.env.VITE_APP_ENV": JSON.stringify(config.name),
      "import.meta.env.VITE_CLIENT_URL": JSON.stringify(
        config.client.publicUrl
      ),
      "import.meta.env.VITE_SERVER_URL": JSON.stringify(
        config.server.publicUrl
      ),
    },

    build: {
      outDir: "dist",
      sourcemap: config.name !== "production",
    },
  };
});
