// config/endpoints.cjs - CommonJS для API
const config = require("./env.cjs");

const endpoints = {
  api: {
    base: config.server.apiBase, // ← ТОЛЬКО ПУТЬ "/api"
    auth: {
      login: "/auth/login",
      register: "/auth/register",
    },
    tests: "/createTest",
    groups: "/groups",
    student: "/student",
    teacher: "/teacher",
    grades: "/grades",
  },

  client: {
    base: config.client.publicUrl,
    home: "/",
    login: "/login",
    dashboard: "/dashboard",
  },

  database: config.database.url,
};

// 🔗 Полные URL для удобства (для клиента)
endpoints.full = {
  auth: {
    login:
      config.server.publicUrl + endpoints.api.base + endpoints.api.auth.login,
    register:
      config.server.publicUrl +
      endpoints.api.base +
      endpoints.api.auth.register,
  },
  tests: config.server.publicUrl + endpoints.api.base + endpoints.api.tests,
  groups: config.server.publicUrl + endpoints.api.base + endpoints.api.groups,
  student: config.server.publicUrl + endpoints.api.base + endpoints.api.student,
  teacher: config.server.publicUrl + endpoints.api.base + endpoints.api.teacher,
  grades: config.server.publicUrl + endpoints.api.base + endpoints.api.grades,
};

// ✅ CommonJS экспорт
module.exports = endpoints;
