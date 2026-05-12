const express = require("express");
const guestController = require("../controllers/guestController");
const validate = require("../middlewares/validateRequest");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const guestValidation = require("../validations/guestValidation");

const router = express.Router();

router.use(authenticate);

router.get("/", validate(guestValidation.list), guestController.list);
router.get("/:id", validate(guestValidation.idParam), guestController.getById);

router.post(
  "/",
  authorize("admin", "staff"),
  validate(guestValidation.create),
  guestController.create
);

router.put(
  "/:id",
  authorize("admin", "staff"),
  validate(guestValidation.update),
  guestController.update
);

router.delete(
  "/:id",
  authorize("admin"),
  validate(guestValidation.idParam),
  guestController.remove
);

module.exports = router;
