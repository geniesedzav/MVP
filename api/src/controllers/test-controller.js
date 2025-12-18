// controllers/test-controller.js
const { PrismaClient } = require("@prisma/client");
const { default: test } = require("node:test");
const prisma = new PrismaClient();
// path не нужен здесь для создания теста, но может понадобиться для других операций

exports.createTest = async (req, res) => {
  // 1. Получаем текстовые данные из req.body
  const {
    title,
    description,
    beginningDate,
    endDate,
    time,
    groupId,
    teacherId,
    questions: questionsJson, // Получаем JSON строку с вопросами
  } = req.body;

  // Или пустым [], если файлы не загружены
  const files = req.files || [];
  console.log(
    "Полученные файлы:",
    files.map((f) => ({ fieldname: f.fieldname, filename: f.filename }))
  );

  // 3. Обрабатываем файлы: находим обложку и файлы вопросов
  let coverImageUrl = null;
  const questionImageFiles = {}; // Объект для хранения файлов вопросов { index: file }

  files.forEach((file) => {
    if (file.fieldname === "img") {
      // Нашли обложку теста
      coverImageUrl = `/img/${file.filename}`; // Путь для сохранения в БД и доступа с клиента
      console.log(`Найдена обложка теста: ${coverImageUrl}`);
    } else if (file.fieldname.startsWith("questionImage_")) {
      // Нашли файл вопроса, извлекаем индекс из fieldname
      try {
        const index = parseInt(file.fieldname.split("_")[1], 10);
        if (!isNaN(index)) {
          questionImageFiles[index] = file; // Сохраняем файл по индексу
          console.log(`Найден файл для вопроса ${index}: ${file.filename}`);
        }
      } catch (e) {
        console.error(
          `Ошибка извлечения индекса из fieldname: ${file.fieldname}`,
          e
        );
      }
    }
  });

  // 4. Валидация и преобразование текстовых данных
  const beginningdate = beginningDate ? new Date(beginningDate) : null;
  const enddatetime = endDate ? new Date(endDate) : null;

  const numericGroupId = parseInt(groupId, 10);
  if (isNaN(numericGroupId)) {
    return res.status(400).json({ message: "Неверный ID группы" });
  }

  const numericTeacherId = parseInt(teacherId, 10);
  if (isNaN(numericTeacherId)) {
    return res.status(400).json({ message: "Неверный ID учителя" });
  }

  const numericTime = parseInt(time, 10);
  if (isNaN(numericTime) || numericTime < 0) {
    return res.status(400).json({ message: "Неверное значение времени" });
  }

  // 5. Парсинг и валидация JSON строки с вопросами
  let parsedQuestionsData;
  try {
    if (!questionsJson || typeof questionsJson !== "string") {
      throw new Error(
        "Отсутствуют данные вопросов или неверный тип (ожидалась JSON строка)"
      );
    }
    parsedQuestionsData = JSON.parse(questionsJson);
    if (!Array.isArray(parsedQuestionsData)) {
      throw new Error("Данные вопросов должны быть массивом");
    }
    // Дополнительная валидация структуры вопросов, если нужно
  } catch (error) {
    console.error("Ошибка парсинга или валидации JSON вопросов:", error);
    return res.status(400).json({
      message: "Неверный формат данных вопросов",
      error: error.message,
    });
  }

  // 6. Создание записи в базе данных Prisma
  try {
    const test = await prisma.testTasks.create({
      data: {
        title,
        description,
        img: coverImageUrl, // Используем найденную обложку (или null)
        beginningdate: beginningdate,
        enddatetime: enddatetime,
        time: numericTime,
        groups: { connect: { id: numericGroupId } },
        teacher: { connect: { id: numericTeacherId } },

        // Создаем вопросы, используя текстовые данные и найденные файлы
        questions: {
          create: parsedQuestionsData.map((questionData, index) => {
            // Ищем файл для текущего вопроса по индексу
            const questionFile = questionImageFiles[index];
            const questionImageUrl = questionFile
              ? `/img/${questionFile.filename}`
              : null;
            console.log(
              `Для вопроса ${index} используется изображение: ${questionImageUrl}`
            );

            return {
              description: questionData.description,
              img: questionImageUrl, // Ссылка на файл вопроса или null
              answers: {
                create: questionData.answers.map((answer) => ({
                  text: answer.text,
                  iscorrect: answer.isCorrect ?? false,
                })),
              },
            };
          }),
        },
      },
      // Включаем связанные данные в ответ
      include: {
        questions: { include: { answers: true } },
        groups: true,
        teacher: true,
      },
    });

    res.status(201).json({
      message: "Тест успешно создан с вопросами и ответами",
      test,
    });
  } catch (error) {
    console.error("Ошибка при создании теста в Prisma:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Ошибка связи: Группа или Учитель с указанным ID не найдены.",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Ошибка при создании теста на сервере",
      // В разработке можно отправлять error.message, на проде лучше убрать
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal Server Error",
    });
  }
};

exports.getIdTest = async (req, res) => {
  const { groupId } = req.params;
  try {
    const test = await prisma.testTasks.findMany({
      where: { groupid: parseInt(groupId, 10) },
      include: {
        groups: true,
      },
    });
    res.status(200).json(test);
  } catch (error) {
    console.error("Ошибка при получении теста", error);
    res.status(500).json({ message: "Ошибка при обработке запроса" });
  }
};
exports.getTest = async (req, res) => {
  const { testId } = req.params;
  try {
    const test = await prisma.testTasks.findUnique({
      where: { id: parseInt(testId, 10) },
    });

    res.status(200).json(test);
  } catch (error) {
    console.error("Ошибка при получении теста", error);
    res.status(500).json({ message: "Ошибка при получении теста" });
  }
};

exports.getIdGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await prisma.students.findUnique({
      where: {
        id: parseInt(groupId, 10),
      },
      include: {
        group: true,
      },
    });
    if (!group) {
      return res.status(404).json({ message: "Группа не найдена" });
    }
    res.status(200).json(group);
  } catch (error) {
    console.error("Ошибка при получении группы", error);
    res.status(500).json({ message: "Ошибка при получении группы" });
  }
};
exports.getQuestions = async (req, res) => {
  const { testId } = req.params;
  console.log(testId);
  try {
    const questions = await prisma.questions.findMany({
      where: { testtaskid: parseInt(testId, 10) },
    });
    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .json({ message: "Вопросы не найдены для данного теста" });
    }
    res.status(200).json(questions);
  } catch (error) {
    console.error("Ошибка при получении вопросов", error);
    res.status(500).json({ message: "ошибка при обработки запроса" });
  }
};
exports.getAnswer = async (req, res) => {
  const { questionId } = req.params;
  try {
    const answers = await prisma.answers.findMany({
      where: { questionid: parseInt(questionId, 10) },
      select: {
        id: true,
        text: true,
        iscorrect: true,
      },
    });
    if (answers.length === 0) {
      return res
        .status(404)
        .json({ message: "Варианты ответа не найдены в вопросе" });
    }
    res.status(200).json(answers);
  } catch (error) {
    console.error("Ошибка при получении ответов", error);
    res.status(500).json({ message: "Ошибка при обработки запроса" });
  }
};
