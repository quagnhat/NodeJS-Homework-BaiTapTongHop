const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.post("/", roleMiddleware("admin", "hr", "staff"), leaveController.createLeave);
router.get("/", roleMiddleware("admin", "hr"), leaveController.getAllLeaves);
router.get("/me", roleMiddleware("admin", "hr", "staff"), leaveController.getMyLeaves);
router.get("/:id", roleMiddleware("admin", "hr", "staff"), leaveController.getLeaveById);
router.patch("/:id/approve", roleMiddleware("admin", "hr"), leaveController.approveLeave);
router.patch("/:id/reject", roleMiddleware("admin", "hr"), leaveController.rejectLeave);

module.exports = router;
