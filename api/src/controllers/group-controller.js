const asyncHandler = require("../middleware/asyncHandler");
const groupService = require("../services/groupService");

exports.addGroup = asyncHandler(async (req, res) => {
  const created = await groupService.createGroup(req.body, req.user);
  res.status(201).json({ message: "Группа создана", group: created });
});
