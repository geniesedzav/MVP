// routes/testRoutes.js
const express = require("express");
const testController = require("../controllers/test-controller");
const router = express.Router();

const upload = require("../middleware/upload");

router.post("/", upload.any(), testController.createTest);

// get запросы
router.get("/tests/:groupId", testController.getIdTest);
router.get("/groups/:groupId/tests", testController.getIdGroup);
router.get("/tests/:testId/questions", testController.getQuestions);
router.get("/questions/:questionId", testController.getAnswer);
router.get("/test/:testId", testController.getTest);
module.exports = router;
