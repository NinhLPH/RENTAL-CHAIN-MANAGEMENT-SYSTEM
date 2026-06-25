const express = require("express");
const {
  createBooking,
  getAvailableRooms,
  getProfile,
  getRentalHistory,
  mockPayBill,
  updateProfile,
} = require("../controllers/controller");
const { requireRenter } = require("../middlewares/middlewares");

const router = express.Router();

router.get("/renter/rooms/available", getAvailableRooms);

router.post("/renter/bookings", requireRenter, createBooking);
router.post("/renter/bills/:billId/mock-payment", requireRenter, mockPayBill);
router.get("/renter/rentals/history", requireRenter, getRentalHistory);
router.get("/renter/profile", requireRenter, getProfile);
router.put("/renter/profile", requireRenter, updateProfile);

module.exports = router;
