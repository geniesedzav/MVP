const {
  getTeachersByAdmin,
  getTeacherEdit,
  updateTeacher,
} = require("../services/adminService");

// 1. Список преподавателей
async function getTeachersController(req, res, next) {
  try {
    const adminId = Number(req.params.id);
    const data = await getTeachersByAdmin(adminId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// 2. Данные для поп-апа редактирования
async function getTeacherEditData(req, res, next) {
  try {
    const adminId = Number(req.params.adminId);
    const teacherId = Number(req.params.teacherId);

    const data = await getTeacherEdit(adminId, teacherId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// 3. Сохранение изменений преподавателя
async function updateTeacherData(req, res, next) {
  try {
    const adminId = Number(req.params.adminId);
    const teacherId = Number(req.params.teacherId);

    const data = await updateTeacher(adminId, teacherId, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// ЭКСПОРТ ВСЕХ КОНТРОЛЛЕРОВ
module.exports = {
  getTeachersController,
  getTeacherEditData,
  updateTeacherData,
};
