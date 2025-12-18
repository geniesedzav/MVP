const express = require("express");
const router = express.Router();
const {
  getTeachersController,
  getTeacherEditData,
  updateTeacherData,
} = require("../controllers/admin-controller");
const {
  getSubjectsController,
  updateSubjectsController,
} = require("../controllers/admin-subjects-controller");

router.get("/:id/teachers", getTeachersController);
router.get("/:adminId/teacher/:teacherId/edit", getTeacherEditData);
router.put("/:adminId/teacher/:teacherId", updateTeacherData);
router.get("/:adminId/subjects", getSubjectsController);
router.put("/:adminId/subjects", updateSubjectsController);
module.exports = router;
