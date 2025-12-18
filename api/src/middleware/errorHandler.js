module.exports = (err, req, res, next) => {
  console.error("Обнаружена ошибка: ", err);
  console.error("🔥 ERROR:", err);
  const status = err.status || 500;
  const message = err.publicMessage || "внутренняя ошибка сервера";
  const details =
    process.env.NODE_ENV === "development" ? err.message : undefined;
  res.status(status).json({ message, error: details });
};
