// routes/testRoutes.js
const express = require("express");
const gradesController = require("../controllers/grades-controller");
const router = express.Router();

// get запросы
router.get("/grades/:groupId", gradesController.greadesByGroup);
router.post("/createGrades", gradesController.createGrades);
module.exports = router;
