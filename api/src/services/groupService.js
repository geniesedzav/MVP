const prisma = require("../prismaClient");
const { group_schema } = require("../validators/groupValidator");

async function createGroup(rawData, currentUser) {
  const parsed = group_schema.parse(rawData);

  const { title, course, organization_id } = parsed;

  if (!currentUser) {
    const err = new Error("Попытка несанкционированного доступа");
    err.status = 401;
    err.publicMessage = "Нет авторизации";
    throw err;
  }

  const { id: userId, role_id: roleId } = currentUser;

  const adminRole = await prisma.role.findFirst({
    where: { title: "администратор" },
  });

  if (roleId !== adminRole.id) {
    const err = new Error("Попытка доступа с помощью другой роли");
    err.status = 403;
    err.publicMessage = "Только администратор может создавать группы";
    throw err;
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organization_id },
  });

  if (!organization) {
    const err = new Error("Организация не найдена");
    err.status = 404;
    err.publicMessage = "Организация не найдена";
    throw err;
  }

  if (organization.owner_id !== userId) {
    const err = new Error("Вы не являетесь владельцем этой организации");
    err.status = 403;
    err.publicMessage = "Вы не являетесь владельцем этой организации";
    throw err;
  }

  const course_code = Math.random().toString(36).substring(2, 18).toUpperCase();

  const group = await prisma.group.create({
    data: {
      title,
      course_code,
      organization_id,
    },
    select: {
      title: true,
      course_code: true,
    },
  });

  return group;
}

module.exports = { createGroup };
