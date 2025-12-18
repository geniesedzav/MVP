const { PrismaClient } = require("@prisma/client");
const { group } = require("console");
const { access } = require("fs");
const prisma = new PrismaClient();

exports.greadesByGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const grades = await prisma.grades.findMany({
      where: {
        students: {
          groupId: parseInt(groupId, 10),
        },
      },
      include: {
        students: {
          select: {
            id: true,
            lastname: true,
            name: true,
            patronymic: true,
          },
        },
      },
    });

    // Группируем оценки по студентам
    const studentGradesMap = grades.reduce((acc, grade) => {
      const studentId = grade.students.id;
      if (!acc[studentId]) {
        acc[studentId] = {
          ...grade.students,
          grades: [],
        };
      }
      acc[studentId].grades.push(grade.grade);
      return acc;
    }, {});

    const studentGrades = Object.values(studentGradesMap);

    if (studentGrades.length === 0) {
      return res.status(404).json({ message: "Фамилии и оценки не найдены" });
    }

    res.status(200).json(studentGrades);
  } catch (error) {
    console.error("Ошибка при получении оценок", error);
    res.status(500).json({ message: "Ошибка при получении оценок" });
  }
};
exports.createGrades = async (req, res) => {
  // 1. Получаем необходимые данные из ТЕЛА запроса (req.body)
  // testId и testTitle теперь не используются для записи в БД Grades
  const { studentId, grade, date /* , testId, testTitle */ } = req.body;

  // 2. Базовая валидация входных данных
  if (studentId === undefined || grade === undefined || date === undefined) {
    return res
      .status(400)
      .json({
        message: "Отсутствуют обязательные поля: studentId, grade, date.",
      });
  }

  // 3. Преобразование типов и дополнительная валидация
  const numericStudentId = parseInt(studentId, 10);
  const numericGrade = parseInt(grade, 10); // Используйте parseFloat(grade), если оценка может быть дробной

  if (isNaN(numericStudentId)) {
    return res.status(400).json({ message: "studentId должен быть числом." });
  }
  if (isNaN(numericGrade)) {
    return res.status(400).json({ message: "grade должен быть числом." });
  }

  const gradeDate = new Date(date);
  if (isNaN(gradeDate.getTime())) {
    return res.status(400).json({ message: "Некорректный формат даты." });
  }

  // Подготовка данных для Prisma (только те поля, что есть в модели Grades)
  const dataToCreate = {
    students: {
      // Связь с моделью Students (поле 'students' в модели Grades)
      connect: {
        id: numericStudentId,
      },
    },
    grade: numericGrade,
    date: gradeDate,
    // Поле 'studentid' будет заполнено Prisma автоматически из-за связи 'students'
    // и указания 'fields: [studentid]' в @relation
  };

  console.log(
    "Данные для создания оценки (без testId, testTitle):",
    dataToCreate
  );

  try {
    // 4. Создание записи в базе данных
    const newGradeEntry = await prisma.grades.create({
      data: dataToCreate,
    });

    // 5. Успешный ответ клиенту
    return res
      .status(201)
      .json({ message: "Оценка успешно добавлена", data: newGradeEntry });
  } catch (error) {
    console.error("Ошибка при добавлении оценки:", error);

    // 6. Обработка ошибок Prisma
    if (error.code === "P2025") {
      // "Запись для связи не найдена"
      return res
        .status(404)
        .json({ message: `Студент с ID ${numericStudentId} не найден.` });
    }
    // Другие специфичные ошибки Prisma можно добавить здесь

    // Общая ошибка сервера
    if (!res.headersSent) {
      return res
        .status(500)
        .json({
          message: "Ошибка на сервере при добавлении оценки",
          error: error.message,
        });
    }
  }
};
