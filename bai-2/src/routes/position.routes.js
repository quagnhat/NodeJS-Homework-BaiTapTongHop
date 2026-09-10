const express = require("express");
const router = express.Router();
const positionController = require("../controllers/position.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.use(authMiddleware);

router.get("/", roleMiddleware("admin", "hr", "staff"), positionController.getAllPositions);
router.get("/:id", roleMiddleware("admin", "hr", "staff"), positionController.getPositionById);
router.post("/", roleMiddleware("admin", "hr"), positionController.createPosition);
router.put("/:id", roleMiddleware("admin", "hr"), positionController.updatePosition);
router.delete("/:id", roleMiddleware("admin"), positionController.deletePosition);

module.exports = router;
