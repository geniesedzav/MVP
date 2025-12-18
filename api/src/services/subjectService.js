const prisma = require("../prismaClient");

async function checkOrg(adminId) {
  const admin = await prisma.user.findFirst({
    where: { id: adminId },
    include: { role: true },
  });
  if (!admin || admin.role.title !== "администратор") {
    const err = new Error("Нет прав администратора");
    err.status = 403;
    err.publicMessage = err.message;
    throw err;
  }
  const org = await prisma.organization.findFirst({
    where: { owner_id: adminId },
    select: { id: true },
  });

  if (!org) {
    const err = new Error("Организация не найдена");
    err.status = 404;
    err.publicMessage = err.message;
    throw err;
  }
  return org;
}

async function getSubjects(adminId) {
  const org = await checkOrg(adminId);
  const subjects = await prisma.subject.findMany({
    where: { id_organization: org.id },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });
  return subjects;
}

async function updateSubjects(adminId, body) {
  const org = await checkOrg(adminId);

  const input = Array.isArray(body.subjects) ? body.subjects : [];

  // Нормализуем: trim, убираем пустые
  const normalized = input
    .map((s) => ({
      id: s.id ? Number(s.id) : null,
      title: String(s.title ?? "").trim(),
    }))
    .filter((s) => s.title.length > 0);

  // Проверка дублей по title внутри одного сохранения (иначе словишь @@unique(title, org))
  const titles = normalized.map((s) => s.title.toLowerCase());
  const dup = titles.find((t, i) => titles.indexOf(t) !== i);
  if (dup) {
    const err = new Error("Есть одинаковые названия предметов");
    err.status = 400;
    err.publicMessage = err.message;
    throw err;
  }

  return await prisma.$transaction(async (tx) => {
    // Текущие предметы организации
    const existing = await tx.subject.findMany({
      where: { id_organization: org.id },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((s) => s.id));

    const keepIds = new Set(normalized.filter((s) => s.id).map((s) => s.id));

    // 1) Обновляем те, что пришли с id
    for (const s of normalized) {
      if (!s.id) continue;

      // защита: нельзя обновлять чужие предметы
      if (!existingIds.has(s.id)) {
        const err = new Error("Попытка изменить предмет не своей организации");
        err.status = 403;
        err.publicMessage = err.message;
        throw err;
      }

      await tx.subject.update({
        where: { id: s.id },
        data: { title: s.title },
      });
    }

    // 2) Создаём новые (без id)
    for (const s of normalized) {
      if (s.id) continue;

      await tx.subject.create({
        data: {
          title: s.title,
          id_organization: org.id,
        },
      });
    }

    // 3) Удаляем те, что были, но не пришли
    const idsToDelete = [...existingIds].filter((id) => !keepIds.has(id));

    if (idsToDelete.length > 0) {
      // Проверим ссылки (иначе FK ошибка)
      const usedInTeacherSubject = await tx.teacherSubject.count({
        where: { subject_id: { in: idsToDelete } },
      });

      const usedInTeacherGroups = await tx.teacherGroupsSubject.count({
        where: { subject_id: { in: idsToDelete } },
      });

      if (usedInTeacherSubject > 0 || usedInTeacherGroups > 0) {
        const err = new Error(
          "Нельзя удалить предмет: он уже используется (назначен преподавателю/группе)"
        );
        err.status = 400;
        err.publicMessage = err.message;
        throw err;
      }

      await tx.subject.deleteMany({
        where: { id: { in: idsToDelete }, id_organization: org.id },
      });
    }

    return { success: true };
  });
}
module.exports = {
  getSubjects,
  updateSubjects,
};
