const express = require("express");
const router = express.Router();
const authRequired = require("../middleware/authRequired");
const groupController = require("../controllers/group-controller");

router.post("/groups", authRequired, groupController.addGroup);

module.exports = router;
