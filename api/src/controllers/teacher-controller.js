const asyncHandler = require("../middleware/asyncHandler");
const teacherService = require("../services/teacherService");

exports.initTeacher = asyncHandler(async (req, res) => {
  const result = await teacherService.initTeacher(req.user, req.body);

  res.status(200).json({
    message: "Профиль преподавателя успешно инициализирован",
    ...result,
  });
});
exports.getTeacherState = asyncHandler(async (req, res) => {
  const data = await teacherService.getTeacherState(req.user);
  res.json(data);
});
