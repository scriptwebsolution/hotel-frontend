const express = require("express");
const bookingController = require("../controllers/bookingController");
const validate = require("../middlewares/validateRequest");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const bookingValidation = require("../validations/bookingValidation");

const router = express.Router();

router.use(authenticate);

router.post("/", validate(bookingValidation.create), bookingController.createBooking);
router.get("/me", validate(bookingValidation.list), bookingController.getMyBookings);

router.get(
  "/",
  authorize("admin", "staff"),
  validate(bookingValidation.list),
  bookingController.getAllBookings
);

router.get("/:id", validate(bookingValidation.idParam), bookingController.getBooking);
router.post("/:id/cancel", validate(bookingValidation.idParam), bookingController.cancelBooking);

router.patch(
  "/:id/status",
  authorize("admin", "staff"),
  validate(bookingValidation.updateStatus),
  bookingController.updateBookingStatus
);

module.exports = router;
