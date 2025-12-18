const { z } = require("zod");

const group_schema = z.object({
  title: z
    .string()
    .min(1, "Название группы обязателен")
    .max(6, "Название группы не может быть длиннее 6 символов")
    .transform((t) => t.trim()),
  course: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, "Группа должна иметь курс (минимум 1)")
      .max(99, "Курс не может быть больше 12")
  ),
  organization_id: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Группа не может существовать без организации")
  ),
});

module.exports = { group_schema };
