const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validateRequest");
const { authenticate } = require("../middlewares/authMiddleware");
const authValidation = require("../validations/authValidation");

const router = express.Router();

router.post("/register", validate(authValidation.register), authController.register);
router.post("/login", validate(authValidation.login), authController.login);
router.post(
  "/google",
  validate(authValidation.googleAuth),
  authController.googleAuth
);
router.get("/me", authenticate, authController.me);

module.exports = router;
