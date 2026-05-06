const express = require("express");
const roomFacilityController = require("../controllers/roomFacilityController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/list", roomFacilityController.getFacilityList);
router.delete("/list/:id", roomFacilityController.deleteFacility);

router.get("/details", roomFacilityController.getFacilityDetailsList);
router.delete("/details/:id", roomFacilityController.deleteFacilityDetails);

router.get("/sizes", roomFacilityController.getRoomSizeList);
router.delete("/sizes/:id", roomFacilityController.deleteRoomSize);

module.exports = router;
