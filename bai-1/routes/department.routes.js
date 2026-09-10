const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.get("/", roleMiddleware("admin", "hr", "staff"), departmentController.getAllDepartments);
router.get("/:id", roleMiddleware("admin", "hr", "staff"), departmentController.getDepartmentById);
router.post("/", roleMiddleware("admin", "hr"), departmentController.createDepartment);
router.put("/:id", roleMiddleware("admin", "hr"), departmentController.updateDepartment);
router.delete("/:id", roleMiddleware("admin"), departmentController.deleteDepartment);

module.exports = router;
