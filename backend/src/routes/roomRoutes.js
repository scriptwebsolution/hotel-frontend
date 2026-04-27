const express = require("express");
const roomController = require("../controllers/roomController");
const validate = require("../middlewares/validateRequest");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const roomValidation = require("../validations/roomValidation");

const router = express.Router();

router.get("/", roomController.list);
router.get("/availability", validate(roomValidation.availability), roomController.availability);
router.get("/:id", validate(roomValidation.idParam), roomController.getOne);

router.post(
  "/",
  authenticate,
  authorize("admin", "staff"),
  validate(roomValidation.create),
  roomController.create
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin", "staff"),
  validate(roomValidation.update),
  roomController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(roomValidation.idParam),
  roomController.remove
);

module.exports = router;
