const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// ✅ ИМПОРТ КОНФИГУРАЦИИ ИЗ КОРНЯ ПРОЕКТА (CommonJS)
const config = require("../config/env.cjs");
const endpoints = require("../config/endpoints.cjs");

// ✅ ИМПОРТ МАРШРУТОВ
const adminRouter = require("./src/router/admin-router");
const authRoutes = require("./src/router/auth-router");
const testRoutes = require("./src/router/test-router");
const groupRoutes = require("./src/router/group-router");
const studentRoutes = require("./src/router/student-router");
const teacherRoutes = require("./src/router/teacher-router");
const gradesRouter = require("./src/router/grades-router");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = config.server.port;

app.use(helmet());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 20, // 20 попыток логина/регистрации
});
// ✅ CORS — ТЕПЕРЬ ИЗ КОНФИГА
const corsOptions = {
  origin: config.client.publicUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "src", "public", "img")));

app.use("*", (req, res, next) => {
  console.log(`🔍 Incoming: ${req.method} ${req.originalUrl}`);
  next();
});

// Логирование API запросов
app.use("/api", (req, res, next) => {
  console.log(`🌐 API: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ ПОДКЛЮЧЕНИЕ МАРШРУТОВ ЧЕРЕЗ КОНФИГ
app.use(`${endpoints.api.base}/auth`, authRoutes, authLimiter);
app.use(`${endpoints.api.base}/createTest`, testRoutes);
app.use(`${endpoints.api.base}/groups`, groupRoutes);
app.use(`${endpoints.api.base}/student`, studentRoutes);
app.use(`${endpoints.api.base}/teacher`, teacherRoutes);
app.use(`${endpoints.api.base}/grades`, gradesRouter);
app.use(`${endpoints.api.base}/admin`, adminRouter);
// ✅ HEALTH CHECK ENDPOINT
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    environment: config.name,
    timestamp: new Date().toISOString(),
    client: config.client.publicUrl,
    server: config.server.publicUrl,
  });
});

// Обработчик ошибок
app.use(errorHandler);

// ✅ ЗАПУСК СЕРВЕРА С ИНФОРМАЦИЕЙ О СРЕДЕ
app.listen(PORT, () => {
  console.log(`
🚀 Бекенд запущен!
📍 Окружение: ${config.name}
📡 Локальный URL: http://localhost:${PORT}
🌐 Публичный URL: ${config.server.publicUrl}
🔗 API Base: ${endpoints.api.base}
🎯 Клиент: ${config.client.publicUrl}
⏰ Запущен: ${new Date().toISOString()}
  `);
});
