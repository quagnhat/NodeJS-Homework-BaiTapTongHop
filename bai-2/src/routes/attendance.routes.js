const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.post("/check-in", roleMiddleware("admin", "hr", "staff"), attendanceController.checkIn);
router.post("/check-out", roleMiddleware("admin", "hr", "staff"), attendanceController.checkOut);
router.get("/", roleMiddleware("admin", "hr"), attendanceController.getAllAttendances);
router.get("/me", roleMiddleware("admin", "hr", "staff"), attendanceController.getMyAttendances);
router.get("/employee/:employeeId", roleMiddleware("admin", "hr"), attendanceController.getAttendanceByEmployeeId);

module.exports = router;
