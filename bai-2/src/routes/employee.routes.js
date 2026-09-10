const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.get("/", roleMiddleware("admin", "hr", "staff"), employeeController.getAllEmployees);
router.get("/:id", roleMiddleware("admin", "hr", "staff"), employeeController.getEmployeeById);
router.post("/", roleMiddleware("admin", "hr"), employeeController.createEmployee);
router.put("/:id", roleMiddleware("admin", "hr"), employeeController.updateEmployee);
router.delete("/:id", roleMiddleware("admin"), employeeController.deleteEmployee);

module.exports = router;
