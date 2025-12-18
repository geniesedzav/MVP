const { z } = require("zod");

const subject_schema = z.object({
  title: z
    .string()
    .min(1, "Название предмета обязательно")
    .max(25, "Название предмета не может быть больше 25 букв")
    .transform((t) => t.trim()),
});

const teacherSubject_schema = z.object({
  teacher_id: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Добавьте учителя")
  ),
  subject_id: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Добавьте предмет")
  ),
});

module.exports = { subject_schema, teacherSubject_schema };
