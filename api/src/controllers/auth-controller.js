const asyncHandler = require("../middleware/asyncHandler");
const authService = require("../services/authService");

//контроллер только вызывает сервис и возвращает ответы
exports.register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res
    .status(201)
    .json({ message: "Пользователь успешно зарегистрирован", user });
});

exports.login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  res.status(200).json({ message: "Успешный вход", user, token });
});
