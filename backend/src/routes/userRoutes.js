const express = require("express");
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", userController.listUsers);
router.get("/:id", userController.getUser);

module.exports = router;
