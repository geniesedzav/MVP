const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const {
  register_schema,
  login_schema,
} = require("../validators/authValidator");

const SALT_ROUNDS = 12;

async function registerUser(rawData) {
  const parsed = register_schema.parse(rawData);
  const { login, password, role } = parsed;

  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    const err = new Error("Пользователь с таким логином уже существует");
    err.status = 400;
    err.publicMessage = err.message;
    throw err;
  }

  const roleRecord = await prisma.role.findFirst({ where: { title: role } });
  if (!roleRecord) {
    const err = new Error("Роль не найдена");
    err.status = 400;
    err.publicMessage = "Указанная роль не найдена в системе";
    throw err;
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        login,
        password_hash,
        role_id: roleRecord.id,
        date: new Date(),
      },
      select: {
        id: true,
        login: true,
        role_id: true,
        date: true,
      },
    });

    if (roleRecord.title === "администратор") {
      const organization = await tx.organization.create({
        data: {
          name: `Организация ${login}`,
          description: `Организация администратора ${login}`,
          owner_id: created.id,
        },
      });
      return { ...created, organization };
    }

    return created;
  });

  return result;
}

async function loginUser(rawData) {
  const parsed = login_schema.parse(rawData);
  const { login, password } = parsed;

  const user = await prisma.user.findUnique({ where: { login } });
  if (!user) {
    const err = new Error("Неверный логин или пароль");
    err.status = 401;
    err.publicMessage = "Неверный логин или пароль";
    throw err;
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    const err = new Error("неверный логин или пароль");
    err.status = 401;
    err.publecMessage = "Неверный логин или пароль";
    throw err;
  }

  //полезная нагрузка для токена
  const payload = { id: user.id, role_id: user.role_id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  //скрываем password_hash в ответе
  const { password_hash, ...userSafe } = user;
  return { user: userSafe, token };
}

module.exports = { registerUser, loginUser };
