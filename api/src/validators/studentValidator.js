const { z } = require("zod");

const student_schema = z.object({
  name: z
    .string()
    .min(3, "Имя не может быть меньше 3 букв")
    .max(25, "Слишком большое имя")
    .transform((n) => n.trim()),
  last_name: z
    .string()
    .min(5, "Фамилия не может быть меньше 5 букв")
    .max(40, "Слишком большая фамилия")
    .transform((n) => n.trim()),
  patronymic: z
    .string()
    .min(7, "Отчество не может быть меньше 7 букв")
    .max(40, "Слшиком большое отчество")
    .transform((n) => n.trim()),
  user_id: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Студент не может существовать без user")
  ),
});
const studentGroup_schema = z.object({
  code: z.string().min(1, "Код группы обязателен"),
});

module.exports = { student_schema, studentGroup_schema };
