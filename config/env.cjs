// config/env.cjs - CommonJS для API
const environments = {
  development: {
    name: "development",
    client: {
      port: 5173,
      host: "http://localhost:5173",
      publicUrl: "http://localhost:5173",
    },
    server: {
      port: 8080,
      host: "http://localhost:8080",
      publicUrl: "http://localhost:8080",
      apiBase: "/api",
    },
    database: {
      url: "postgresql://user:password@localhost:5432/platforma_db",
    },
  },

  codespaces: {
    name: "codespaces",
    client: {
      port: 8081,
      host: "http://localhost:8081",
      publicUrl:
        "https://legendary-waddle-pj95gxxjrpr5366vq-8081.app.github.dev",
    },
    server: {
      port: 8080,
      host: "http://localhost:8080",
      publicUrl:
        "https://legendary-waddle-pj95gxxjrpr5366vq-8080.app.github.dev",
      apiBase: "/api",
    },
    database: {
      url: "postgresql://user:password@db:5432/platforma_db",
    },
  },

  production: {
    name: "production",
    client: {
      port: 3000,
      host: "https://tvoi-domain.com",
      publicUrl: "https://tvoi-domain.com",
    },
    server: {
      port: 8080,
      host: "http://localhost:8080",
      publicUrl: "https://api.tvoi-domain.com",
      apiBase: "/api",
    },
    database: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://user:password@production-db:5432/platforma_db",
    },
  },
};

// 🔍 Автодетект окружения
const getEnvironment = () => {
  if (process.env.CODESPACES === "true") return "codespaces";
  if (process.env.NODE_ENV === "production") return "production";
  if (process.env.GITHUB_CODESPACES === "true") return "codespaces";
  return "development";
};

const currentEnv = getEnvironment();
console.log(`🎯 Загружена конфигурация: ${currentEnv}`);

// ✅ CommonJS экспорт
module.exports = environments[currentEnv];
