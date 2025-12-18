const express = require("express");
const teacherController = require("../controllers/teacher-controller");
const authRequired = require("../middleware/authRequired");

const router = express.Router();

router.get("/state", authRequired, teacherController.getTeacherState);
router.post("/init", authRequired, teacherController.initTeacher);

module.exports = router;
