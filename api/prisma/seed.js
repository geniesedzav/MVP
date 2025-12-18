const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const TEACHER_ROLE = 1;
const STUDENT_ROLE = 2;

const teacherUsers = [
  {
    login: "Kozlov",
    password: "pass1111",
    fio: ["Максим", "Козлов", "Валерьевич"],
  },
  {
    login: "Chubarova",
    password: "pass2222",
    fio: ["Ольга", "Чубарова", "Борисовна"],
  },
  {
    login: "Kotikov",
    password: "pass3333",
    fio: ["Андрей", "Котиков", "Андреевич"],
  },
];

const groups = [
  { title: "АТ1-11", course: 1 },
  { title: "ИП1-11", course: 1 },
  { title: "ИП1-21", course: 2 },
  { title: "ИП1-31", course: 3 },
  { title: "ДЗ1-31", course: 3 },
];

// Студенты с примерными логинами/паролями
const exampleStudents = [
  { login: "stud001", password: "111111", fio: ["Иван", "Иванов", "Иванович"] },
  { login: "stud002", password: "222222", fio: ["Петр", "Петров", "Петрович"] },
  {
    login: "stud003",
    password: "333333",
    fio: ["Сидор", "Сидоров", "Сидорович"],
  },
  { login: "stud004", password: "444444", fio: ["Олег", "Олегов", "Олегович"] },
  {
    login: "stud005",
    password: "555555",
    fio: ["Анна", "Аннова", "Андреевна"],
  },
  {
    login: "stud006",
    password: "666666",
    fio: ["Мария", "Маркова", "Михайловна"],
  },
  {
    login: "stud007",
    password: "777777",
    fio: ["Елена", "Еленова", "Егоровна"],
  },
];

async function wipeAll() {
  // Удаляем в правильном порядке (от зависимых к независимым)
  await prisma.grades.deleteMany({});
  await prisma.answers.deleteMany({});
  await prisma.questions.deleteMany({});
  await prisma.testTasks.deleteMany({});
  await prisma.teacherGroups.deleteMany({});
  await prisma.students.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.groups.deleteMany({});
  await prisma.role.deleteMany({});
}

async function addGrades() {
  const students = await prisma.students.findMany();

  const today = new Date();

  let gradesData = [];
  for (const student of students) {
    for (let i = 1; i <= 5; i++) {
      // Дата для каждой оценки немного разная
      const date = new Date(today);
      date.setDate(today.getDate() - (5 - i));
      gradesData.push({
        studentid: student.id,
        grade: i,
        date,
      });
    }
  }

  await prisma.grades.createMany({
    data: gradesData,
    skipDuplicates: true,
  });

  console.log(
    `Добавлено ${gradesData.length} оценок для ${students.length} студентов`
  );
}

async function main() {
  console.log("Удаляем все данные...");
  await wipeAll();

  // 1. Создание ролей
  await prisma.role.createMany({
    data: [
      { id: TEACHER_ROLE, title: "Преподаватель" },
      { id: STUDENT_ROLE, title: "Студент" },
    ],
  });

  // 2. Создание групп
  for (let i = 0; i < groups.length; i++) {
    await prisma.groups.create({
      data: { title: groups[i].title, course: groups[i].course },
    });
  }

  // 3. Преподаватели (Users + Teachers)
  for (let i = 0; i < teacherUsers.length; i++) {
    const { login, password, fio } = teacherUsers[i];
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        login,
        passwordhash: hash,
        roleid: TEACHER_ROLE,
      },
    });

    await prisma.teacher.create({
      data: {
        name: fio[0],
        lastname: fio[1],
        patronymic: fio[2],
        userid: user.id,
      },
    });
  }

  // 4. Студенты (Users + Students)
  // Сначала 7 студентов с известными паролями
  for (let i = 0; i < exampleStudents.length; i++) {
    const { login, password, fio } = exampleStudents[i];
    const hash = await bcrypt.hash(password, 10);
    // Раздаем по группам циклично
    const groupId = i % groups.length;

    // Получаем id группы
    const group = await prisma.groups.findFirst({
      where: { title: groups[groupId].title },
    });

    const user = await prisma.user.create({
      data: {
        login,
        passwordhash: hash,
        roleid: STUDENT_ROLE,
      },
    });

    await prisma.students.create({
      data: {
        name: fio[0],
        lastname: fio[1],
        patronymic: fio[2],
        userId: user.id,
        groupId: group.id,
      },
    });
  }

  // Остальные 110 студентов (рандомные данные)
  for (let i = 7; i < 117; i++) {
    const login = `student${(i + 1).toString().padStart(3, "0")}`;
    const password = Math.random().toString(36).slice(-8); // рандомный пароль
    const hash = await bcrypt.hash(password, 10);
    const groupId = i % groups.length;
    const group = await prisma.groups.findFirst({
      where: { title: groups[groupId].title },
    });

    const user = await prisma.user.create({
      data: {
        login,
        passwordhash: hash,
        roleid: STUDENT_ROLE,
      },
    });

    await prisma.students.create({
      data: {
        name: `Имя${i + 1}`,
        lastname: `Фамилия${i + 1}`,
        patronymic: `Отчество${i + 1}`,
        userId: user.id,
        groupId: group.id,
      },
    });
  }

  // 5. TeacherGroups: получаем id учителей и групп динамически
  const teachersDb = await prisma.teacher.findMany({
    include: { users: true },
  });
  const groupsDb = await prisma.groups.findMany();

  function getTeacherIdByLogin(login) {
    const found = teachersDb.find((t) => t.users.login === login);
    return found ? found.id : null;
  }
  function getGroupIdByTitle(title) {
    const found = groupsDb.find((g) => g.title === title);
    return found ? found.id : null;
  }

  await prisma.teacherGroups.createMany({
    data: [
      {
        teacherId: getTeacherIdByLogin("Kozlov"),
        groupId: getGroupIdByTitle("АТ1-11"),
      },
      {
        teacherId: getTeacherIdByLogin("Kozlov"),
        groupId: getGroupIdByTitle("ИП1-11"),
      },
      {
        teacherId: getTeacherIdByLogin("Chubarova"),
        groupId: getGroupIdByTitle("ИП1-21"),
      },
      {
        teacherId: getTeacherIdByLogin("Chubarova"),
        groupId: getGroupIdByTitle("ИП1-31"),
      },
      {
        teacherId: getTeacherIdByLogin("Kotikov"),
        groupId: getGroupIdByTitle("ДЗ1-31"),
      },
    ],
  });

  // 6. Оценки
  await addGrades();

  console.log("\n------ Преподаватели (логин/пароль) ------");
  teacherUsers.forEach((t) => console.log(`${t.login} / ${t.password}`));
  console.log("\n------ Примеры студентов (логин/пароль) ------");
  exampleStudents.forEach((s) => console.log(`${s.login} / ${s.password}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
