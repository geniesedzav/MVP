const asyncHalder = require("../middleware/asyncHandler");
const studentService = require("../services/studentService");

exports.addStudent = asyncHalder(async (req, res) => {
  const created = await studentService.createStudent(req.body, req.user);
  res
    .status(201)
    .json({ message: "Вы успешно добавили информацию", student: created });
});

exports.joinGroup = asyncHalder(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Код группы обязателен" });
  }

  const created = await studentService.createStudentGroup(
    req.body,
    req.user,
    code
  );

  res.status(201).json({
    message: "Вы успешно добавлены в группу",
    data: created,
  });
});
