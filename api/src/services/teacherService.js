const prisma = require("../prismaClient");

// Инициализация преподавателя
async function initTeacher(user, body) {
  const { name, last_name, patronymic, organization_code } = body;

  // 1) Достаём пользователя из БД + роль
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { role: true },
  });

  if (!dbUser || dbUser.role.title !== "учитель") {
    const err = new Error("Нет прав преподавателя");
    err.status = 403;
    err.publicMessage = err.message;
    throw err;
  }

  // 2) Проверяем, существует ли teacher
  const teacherExists = await prisma.teacher.findFirst({
    where: { user_id: dbUser.id },
    select: { id: true },
  });

  if (teacherExists) {
    const err = new Error("Преподаватель уже инициализирован");
    err.status = 409;
    err.publicMessage = err.message;
    throw err;
  }

  // 3) Проверяем организацию по коду
  const organization = await prisma.organization.findFirst({
    where: { code: organization_code },
    select: { id: true },
  });

  if (!organization) {
    const err = new Error("Организация не найдена");
    err.status = 400;
    err.publicMessage = err.message;
    throw err;
  }

  // 4-5) Создаём teacher + связь в транзакции
  const result = await prisma.$transaction(async (tx) => {
    const teacher = await tx.teacher.create({
      data: {
        user_id: dbUser.id,
        name,
        last_name,
        patronymic,
      },
      select: { id: true },
    });

    await tx.organizationTeacher.create({
      data: {
        teacher_id: teacher.id,
        organization_id: organization.id,
      },
    });

    return teacher;
  });

  return {
    success: true,
    teacher_id: result.id,
  };
}

// Статус преподавателя (нужно ли показывать модалку)
async function getTeacherState(user) {
  // Быстрая проверка роли по токену (для MVP норм)
  if (user.role_id !== 3) {
    const err = new Error("Нет прав преподавателя");
    err.status = 403;
    err.publicMessage = err.message;
    throw err;
  }

  const teacher = await prisma.teacher.findFirst({
    where: { user_id: user.id },
    select: { id: true },
  });

  return {
    role: user.role_id,
    teacherInitialized: Boolean(teacher),
    teacherId: teacher?.id ?? null,
  };
}

module.exports = {
  initTeacher,
  getTeacherState,
};

module.exports = { initTeacher, getTeacherState };
