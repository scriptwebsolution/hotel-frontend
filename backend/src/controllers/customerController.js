const customerService = require("../services/customerService");
const asyncHandler = require("../utils/asyncHandler");

const getCustomers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  const offset = parseInt(req.query.offset, 10) || 0;
  
  const customers = await customerService.getCustomers({ limit, offset });
  res.status(200).json({ success: true, data: customers });
});

const getGuests = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  const offset = parseInt(req.query.offset, 10) || 0;

  const guests = await customerService.getGuests({ limit, offset });
  res.status(200).json({ success: true, data: guests });
});

module.exports = {
  getCustomers,
  getGuests
};
