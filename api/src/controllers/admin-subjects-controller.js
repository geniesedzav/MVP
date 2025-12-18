const asyncHandler = require("../middleware/asyncHandler");
const subjectService = require("../services/subjectService");

exports.getSubjectsController = asyncHandler(async (req, res) => {
  const adminId = Number(req.params.adminId);
  const data = await subjectService.getSubjects(adminId);
  res.json(data);
});

exports.updateSubjectsController = asyncHandler(async (req, res) => {
  const adminId = Number(req.params.adminId);
  const data = await subjectService.updateSubjects(adminId, req.body);
  res.json(data);
});
