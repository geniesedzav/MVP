const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("Токен отсутствует или имеет неверный формат");
    err.status = 401;
    err.publicMessage = err.message;
    throw err;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const err = new Error("Недействительный или истёкший токен");
    err.status = 401;
    err.publicMessage = err.message;
    throw err;
  }
}

module.exports = authMiddleware;
