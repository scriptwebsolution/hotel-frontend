const roomFacilityService = require("../services/roomFacilityService");
const asyncHandler = require("../utils/asyncHandler");

const getFacilityList = asyncHandler(async (req, res) => {
  const data = await roomFacilityService.getFacilityList();
  res.status(200).json({ success: true, data });
});

const getFacilityDetailsList = asyncHandler(async (req, res) => {
  const data = await roomFacilityService.getFacilityDetails();
  res.status(200).json({ success: true, data });
});

const getRoomSizeList = asyncHandler(async (req, res) => {
  const data = await roomFacilityService.getRoomSizes();
  res.status(200).json({ success: true, data });
});

const deleteFacility = asyncHandler(async (req, res) => {
  await roomFacilityService.deleteFacility(req.params.id);
  res.status(200).json({ success: true, message: "Deleted successfully" });
});

const deleteFacilityDetails = asyncHandler(async (req, res) => {
  await roomFacilityService.deleteFacilityDetails(req.params.id);
  res.status(200).json({ success: true, message: "Deleted successfully" });
});

const deleteRoomSize = asyncHandler(async (req, res) => {
  await roomFacilityService.deleteRoomSize(req.params.id);
  res.status(200).json({ success: true, message: "Deleted successfully" });
});

module.exports = {
  getFacilityList,
  getFacilityDetailsList,
  getRoomSizeList,
  deleteFacility,
  deleteFacilityDetails,
  deleteRoomSize,
};
