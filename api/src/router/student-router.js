const express = require("express");
const studentController = require("../controllers/student-controller");
const authRequired = require("../middleware/authRequired");
const router = express.Router();

router.post("/create", authRequired, studentController.addStudent);
router.post("/add-group", authRequired, studentController.joinGroup);
router.post("/join", authRequired, studentController.joinGroup);
module.exports = router;
