// config/env.js - ES модуль для фронтенда
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
};

const getEnvironment = () => {
  if (process.env.CODESPACES === "true") return "codespaces";
  if (process.env.NODE_ENV === "production") return "production";
  if (process.env.GITHUB_CODESPACES === "true") return "codespaces";
  return "development";
};

const currentEnv = getEnvironment();

// ✅ ES модуль экспорт
export default environments[currentEnv];
