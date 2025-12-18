const { title } = require("process");
const prisma = require("../prismaClient");
const {
  subject_schema,
  teacherSubject_schema,
} = require("../validators/adminValidators");
const { roles } = require("../validators/authValidator");
const { throws } = require("assert");
const { group } = require("console");

async function createSubjects(rawData, currentUser) {
  // Валидация входных данных
  const parsed = subject_schema.parse(rawData);
  const { title } = parsed;

  // Проверка авторизации
  if (!currentUser) {
    const err = new Error("Попытка несанкционированного доступа");
    err.status = 401;
    err.publicMessage = "Нет авторизации";
    throw err;
  }

  const { id: userId, role_id: roleId } = currentUser;

  // Проверка роли
  const adminRole = await prisma.role.findFirst({
    where: { title: "администратор" },
  });

  if (roleId !== adminRole.id) {
    const err = new Error("Только администратор может добавлять предметы");
    err.status = 403;
    err.publicMessage = err.message;
    throw err;
  }

  // Проверка дублирования предмета
  const existing = await prisma.subject.findFirst({
    where: { title },
  });

  if (existing) {
    const err = new Error("Такой предмет уже существует");
    err.status = 400;
    err.publicMessage = err.message;
    throw err;
  }

  // Создание предмета
  const subject = await prisma.subject.create({
    data: {
      title,
    },
  });

  return subject;
}

async function createTeacherSubject(rawData, currentUser) {
  // Валидация
  const parsed = teacherSubject_schema.parse(rawData);
  const { teacher_id, subject_id } = parsed;

  // Проверка авторизации
  if (!currentUser) {
    const err = new Error("Попытка несанкционированного доступа");
    err.status = 401;
    err.publicMessage = "Нет авторизации";
    throw err;
  }

  const { id: userId, role_id: roleId } = currentUser;

  // Проверка, что это администратор
  const adminRole = await prisma.role.findFirst({
    where: { title: "администратор" },
  });

  if (roleId !== adminRole.id) {
    const err = new Error(
      "Только администратор может связывать предметы с учителями"
    );
    err.status = 403;
    err.publicMessage = err.message;
    throw err;
  }

  // Проверка существования учителя
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacher_id },
  });

  if (!teacher) {
    const err = new Error("Профиль учителя не найден");
    err.status = 404;
    err.publicMessage = err.message;
    throw err;
  }

  // Проверка существования предмета
  const subject = await prisma.subject.findUnique({
    where: { id: subject_id },
  });

  if (!subject) {
    const err = new Error("Предмет не найден");
    err.status = 404;
    err.publicMessage = err.message;
    throw err;
  }

  // Проверяем, не связано ли уже
  const existing = await prisma.teacherSubject.findFirst({
    where: { teacher_id, subject_id },
  });

  if (existing) {
    const err = new Error("Этот учитель уже привязан к этому предмету");
    err.status = 400;
    err.publicMessage = err.message;
    throw err;
  }

  // Создание связи
  const teacherSubject = await prisma.teacherSubject.create({
    data: {
      teacher_id,
      subject_id,
    },
  });

  return teacherSubject;
}

// Получение списка преподавателей по айди админа
async function getTeachersByAdmin(adminId) {
  const admin = await prisma.user.findFirst({
    where: { id: adminId },
    include: { role: true },
  });

  if (!admin || admin.role.title !== "администратор") {
    const err = new Error("Пользователь не является администратором");
    err.status = 403;
    throw err;
  }

  const organization = await prisma.organization.findFirst({
    where: { owner_id: adminId },
  });

  if (!organization) {
    const err = new Error("Организация не найдена");
    err.status = 404;
    throw err;
  }

  const teachers = await prisma.teacher.findMany({
    where: {
      organization_teachers: {
        some: {
          organization_id: organization.id,
        },
      },
    },
    include: {
      teacher_subjects: {
        include: {
          subject: true,
        },
      },
      teacher_groups_subject: {
        include: {
          group: true,
          subject: true,
        },
      },
    },
  });

  const formatted = teachers.map((t) => ({
    id: t.id,
    last_name: t.last_name,
    name: t.name,
    patronymic: t.patronymic,
    role: "преподаватель",
    subjects: t.teacher_subjects
      .map((ts) => {
        const groups = t.teacher_groups_subject
          .filter(
            (gs) =>
              gs.subject_id === ts.subject_id &&
              gs.group.organization_id === organization.id
          )
          .map((gs) => gs.group.title);

        return {
          title: ts.subject.title,
          groups,
        };
      })
      .filter((s) => s.groups.length > 0),
  }));

  return formatted;
}

async function getTeacherEdit(adminId, teacherId) {
  // 1. Проверяем администратора
  const admin = await prisma.user.findFirst({
    where: { id: adminId },
    include: { role: true },
  });

  if (!admin || admin.role.title !== "администратор") {
    const err = new Error(
      "Недостаточно прав. Пользователь не является администратором."
    );
    err.status = 403;
    throw err;
  }

  // 2. Находим организацию админа
  const org = await prisma.organization.findFirst({
    where: { owner_id: adminId },
  });

  if (!org) {
    const err = new Error("Организация не найдена.");
    err.status = 404;
    throw err;
  }

  // 3. Проверяем, что преподаватель принадлежит этой организации
  const orgTeacher = await prisma.organizationTeacher.findFirst({
    where: {
      teacher_id: teacherId,
      organization_id: org.id,
    },
  });

  if (!orgTeacher) {
    const err = new Error(
      "Этот преподаватель не принадлежит вашей организации."
    );
    err.status = 403;
    throw err;
  }

  // 4. Получаем преподавателя + связи предметов + связи групп
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      teacher_subjects: {
        include: { subject: true },
      },
      teacher_groups_subject: {
        include: {
          subject: true,
          group: true,
        },
      },
    },
  });

  if (!teacher) {
    const err = new Error("Преподаватель не найден.");
    err.status = 404;
    throw err;
  }

  // 5. Формируем структуру "предмет -> список групп"
  const subjectsMap = {};

  // Добавляем предметы
  teacher.teacher_subjects.forEach((ts) => {
    subjectsMap[ts.subject_id] = {
      id: ts.subject_id,
      title: ts.subject.title,
      groups: [],
    };
  });

  // Добавляем группы к предметам
  teacher.teacher_groups_subject.forEach((tgs) => {
    if (subjectsMap[tgs.subject_id]) {
      subjectsMap[tgs.subject_id].groups.push({
        id: tgs.group_id,
        title: tgs.group.title,
      });
    }
  });

  // 6. Получаем предметы организации
  const allSubjects = await prisma.subject.findMany({
    where: {
      id_organization: org.id,
    },
    select: { id: true, title: true },
  });

  // 7. Получаем группы организации
  const allGroups = await prisma.group.findMany({
    where: { organization_id: org.id },
    select: { id: true, title: true },
  });

  // 8. Финальный ответ
  return {
    teacher: {
      id: teacher.id,
      last_name: teacher.last_name,
      name: teacher.name,
      patronymic: teacher.patronymic,
    },
    subjects: Object.values(subjectsMap), // предметы преподавателя
    allSubjects, // предметы организации
    allGroups, // группы организации
  };
}

async function updateTeacher(adminId, teacherId, body) {
  const { subjects } = body;

  // Проверки — администратора, организации, принадлежности учителя
  const admin = await prisma.user.findFirst({
    where: { id: adminId },
    include: { role: true },
  });

  if (!admin || admin.role.title !== "администратор") {
    throw new Error("Нет прав администратора");
  }

  const org = await prisma.organization.findFirst({
    where: { owner_id: adminId },
  });

  if (!org) throw new Error("Организация не найдена");

  const orgTeacher = await prisma.organizationTeacher.findFirst({
    where: {
      teacher_id: teacherId,
      organization_id: org.id,
    },
  });

  if (!orgTeacher) {
    throw new Error("Преподаватель не относится к организации");
  }

  // 1. Удаляем ВСЕ teacherGroupsSubject
  await prisma.teacherGroupsSubject.deleteMany({
    where: { teacher_id: teacherId },
  });

  // 2. Удаляем ВСЕ teacherSubject
  await prisma.teacherSubject.deleteMany({
    where: { teacher_id: teacherId },
  });

  // 3. Пересоздаём
  for (const subj of subjects) {
    if (!subj.subject_id) continue;

    // создаём предмет
    await prisma.teacherSubject.create({
      data: {
        teacher_id: teacherId,
        subject_id: subj.subject_id,
      },
    });

    // создаём группы
    for (const groupId of subj.group_ids) {
      await prisma.teacherGroupsSubject.create({
        data: {
          teacher_id: teacherId,
          subject_id: subj.subject_id,
          group_id: groupId,
        },
      });
    }
  }

  return { success: true };
}

module.exports = {
  createSubjects,
  createTeacherSubject,
  getTeachersByAdmin,
  getTeacherEdit,
  updateTeacher,
};
