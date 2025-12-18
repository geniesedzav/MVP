const prisma = require("../prismaClient");
const {
  student_schema,
  studentGroup_schema,
} = require("../validators/studentValidator");

async function createStudent(rawData, currentUser) {
  const parsed = student_schema.parse(rawData);
  const { name, last_name, patronymic } = parsed;

  if (!currentUser) {
    const err = new Error("Попытка несанкционированного доступа");
    err.status = 401;
    err.publicMessage = "Нет авторизации";
    throw err;
  }

  const { id: userId, role_id: roleId } = currentUser;

  const studentRole = await prisma.role.findFirst({
    where: { title: "студент" },
  });

  if (roleId !== studentRole.id) {
    const err = new Error("Попытка доступа с помощью другой роли");
    err.status = 403;
    err.publicMessage = "Только студент может заполнить о себе информацию";
    throw err;
  }

  // Проверяем, существует ли пользователь
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error("Пользователь не найден");
    err.status = 404;
    err.publicMessage = "Пользователь не найден";
    throw err;
  }

  // Проверяем, не создан ли профиль ранее
  const existingStudent = await prisma.student.findUnique({
    where: { user_id: userId },
  });
  if (existingStudent) {
    const err = new Error("Профиль уже существует");
    err.status = 400;
    err.publicMessage = "Вы уже заполнили информацию о себе";
    throw err;
  }

  const student = await prisma.student.create({
    data: {
      name,
      last_name,
      patronymic,
      user_id: userId,
    },
    select: {
      id: true,
      last_name: true,
      name: true,
      patronymic: true,
    },
  });

  return student;
}
async function createStudentGroup(rawData, currentUser) {
  const { code } = rawData;

  if (!currentUser) {
    const err = new Error("Попытка несанкционированного доступа");
    err.status = 401;
    err.publicMessage = "Нет авторизации";
    throw err;
  }

  if (!code) {
    const err = new Error("Код группы обязателен");
    err.status = 400;
    err.publicMessage = err.message;
    throw err;
  }

  // Получаем роль
  const { id: userId, role_id: roleId } = currentUser;
  const studentRole = await prisma.role.findFirst({
    where: { title: "студент" },
  });

  if (roleId !== studentRole.id) {
    const err = new Error("Только студент может добавиться в группу");
    err.status = 403;
    err.publicMessage = err.message;
    throw err;
  }

  // Получаем студента по user_id
  const student = await prisma.student.findUnique({
    where: { user_id: userId },
  });

  if (!student) {
    const err = new Error("Профиль студента не найден");
    err.status = 404;
    err.publicMessage = err.message;
    throw err;
  }

  // Проверяем код группы
  const group = await prisma.group.findFirst({
    where: { course_code: code },
  });

  if (!group) {
    const err = new Error("Неверный код группы");
    err.status = 404;
    err.publicMessage = err.message;
    throw err;
  }

  // Проверяем, не состоит ли уже студент в этой группе
  const existing = await prisma.studentGroup.findFirst({
    where: { student_id: student.id, group_id: group.id },
  });

  if (existing) {
    const err = new Error("Вы уже состоите в этой группе");
    err.status = 400;
    err.publicMessage = err.message;
    throw err;
  }

  // Добавляем студента в группу
  const studentGroup = await prisma.studentGroup.create({
    data: {
      student_id: student.id,
      group_id: group.id,
    },
  });

  return studentGroup;
}

module.exports = { createStudent, createStudentGroup };
