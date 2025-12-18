const { z } = require("zod");

const roles = ["студент", "учитель", "администратор"];
const register_schema = z.object({
  login: z
    .string() // Должен быть строкой (не число, не массив)
    .min(1, "Логин обязателен") // Не пустая строка
    .transform((s) => s.trim()), // Убрать пробелы в начале/конце
  password: z.string().min(8, "Пароль должен быть не меньше 8 символов"),
  role: z
    .string() // Должен быть строкой
    .transform((r) => r.trim().toLowerCase()) // Убрать пробелы + в нижний регистр
    .refine((r) => roles.includes(r), {
      // Проверить, есть ли роль в списке
      message: `Роль должа быть одной из: ${roles.join(",")}`,
    }),
});

const login_schema = z.object({
  login: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  password: z.string().min(1),
});

module.exports = { register_schema, login_schema, roles };
