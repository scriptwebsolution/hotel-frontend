const express = require("express");
const customerController = require("../controllers/customerController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticate); // Secure customer routes

router.get("/", customerController.getCustomers);
router.get("/guests", customerController.getGuests);

module.exports = router;
