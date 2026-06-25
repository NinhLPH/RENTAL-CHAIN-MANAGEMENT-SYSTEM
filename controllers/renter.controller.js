const mongoose = require("mongoose");
const {
  Bill,
  Payment,
  RentalContract,
  Room,
  User,
  UserProfile,
} = require("../db/models");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const toSafeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role,
  status: user.status,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const pickAllowed = (source, allowedFields) => {
  return allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      result[field] = source[field];
    }
    return result;
  }, {});
};

const getAvailableRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ status: "AVAILABLE" })
      .populate({
        path: "houseId",
        match: { status: "ACTIVE" },
        select: "houseName address description totalRooms managerId status",
      })
      .sort({ createdAt: -1 });

    res.json({
      data: rooms.filter((room) => room.houseId),
    });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  let reservedRoom = null;
  let createdContract = null;

  try {
    const { roomId, startDate, endDate } = req.body;

    if (!roomId || !isValidObjectId(roomId)) {
      return res.status(400).json({ message: "Valid roomId is required" });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      return res.status(400).json({ message: "Valid startDate and endDate are required" });
    }

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({ message: "endDate must be after startDate" });
    }

    reservedRoom = await Room.findOneAndUpdate(
      { _id: roomId, status: "AVAILABLE" },
      { $set: { status: "RESERVED" } },
      { new: true }
    ).populate({
      path: "houseId",
      match: { status: "ACTIVE" },
      select: "houseName address description totalRooms managerId status",
    });

    if (!reservedRoom) {
      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      return res.status(409).json({ message: "Room is not available" });
    }

    if (!reservedRoom.houseId) {
      await Room.findByIdAndUpdate(reservedRoom._id, { $set: { status: "AVAILABLE" } });
      return res.status(409).json({ message: "Room belongs to an inactive house" });
    }

    const contract = await RentalContract.create({
      roomId: reservedRoom._id,
      renterId: req.user._id,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      monthlyRent: reservedRoom.rentalPrice || 0,
      depositAmount: reservedRoom.depositAmount || 0,
      status: "ACTIVE",
    });
    createdContract = contract;

    const rentAmount = reservedRoom.rentalPrice || 0;
    const otherAmount = reservedRoom.depositAmount || 0;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const bill = await Bill.create({
      roomId: reservedRoom._id,
      contractId: contract._id,
      billMonth: parsedStartDate.getMonth() + 1,
      billYear: parsedStartDate.getFullYear(),
      rentAmount,
      serviceAmount: 0,
      otherAmount,
      totalAmount: rentAmount + otherAmount,
      dueDate,
      status: "UNPAID",
    });

    res.status(201).json({
      message: "Booking created successfully",
      data: {
        room: reservedRoom,
        contract,
        bill,
      },
    });
  } catch (error) {
    if (createdContract) {
      await RentalContract.findByIdAndDelete(createdContract._id);
    }
    if (reservedRoom) {
      await Room.findByIdAndUpdate(reservedRoom._id, { $set: { status: "AVAILABLE" } });
    }
    next(error);
  }
};

const mockPayBill = async (req, res, next) => {
  try {
    const { billId } = req.params;

    if (!isValidObjectId(billId)) {
      return res.status(400).json({ message: "Invalid billId" });
    }

    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const contract = await RentalContract.findOne({
      _id: bill.contractId,
      renterId: req.user._id,
    });

    if (!contract) {
      return res.status(403).json({ message: "Bill does not belong to this renter" });
    }

    if (bill.status === "PAID") {
      const existingPayment = await Payment.findOne({ billId: bill._id }).sort({
        paymentDate: -1,
        createdAt: -1,
      });

      return res.json({
        message: "Bill is already paid",
        data: {
          bill,
          payment: existingPayment,
        },
      });
    }

    bill.status = "PAID";
    bill.paidAt = new Date();
    await bill.save();

    const payment = await Payment.create({
      billId: bill._id,
      amount: bill.totalAmount || 0,
      paymentMethod: "BANK_TRANSFER",
      paymentDate: bill.paidAt,
      transactionCode: `MOCK-${Date.now()}-${bill._id.toString().slice(-6)}`,
      note: "Mock payment",
    });

    await Room.findByIdAndUpdate(bill.roomId, { $set: { status: "OCCUPIED" } });

    res.json({
      message: "Mock payment completed successfully",
      data: {
        bill,
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRentalHistory = async (req, res, next) => {
  try {
    const contracts = await RentalContract.find({ renterId: req.user._id })
      .populate({
        path: "roomId",
        select: "houseId roomCode roomNumber floor area capacity rentalPrice depositAmount description status",
        populate: {
          path: "houseId",
          select: "houseName address description totalRooms managerId status",
        },
      })
      .sort({ createdAt: -1 });

    const contractIds = contracts.map((contract) => contract._id);
    const bills = await Bill.find({ contractId: { $in: contractIds } })
      .sort({ billYear: -1, billMonth: -1, createdAt: -1 })
      .lean();

    const billIds = bills.map((bill) => bill._id);
    const payments = await Payment.find({ billId: { $in: billIds } })
      .sort({ paymentDate: -1, createdAt: -1 })
      .lean();

    const paymentsByBillId = payments.reduce((result, payment) => {
      const key = payment.billId.toString();
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(payment);
      return result;
    }, {});

    const billsByContractId = bills.reduce((result, bill) => {
      const key = bill.contractId.toString();
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push({
        ...bill,
        payments: paymentsByBillId[bill._id.toString()] || [],
      });
      return result;
    }, {});

    res.json({
      data: contracts.map((contract) => ({
        ...contract.toObject(),
        bills: billsByContractId[contract._id.toString()] || [],
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });

    res.json({
      data: {
        user: toSafeUser(req.user),
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userFields = pickAllowed(req.body, ["fullName", "phone", "avatar"]);
    const profileFields = pickAllowed(req.body, [
      "gender",
      "dob",
      "address",
      "cccd",
      "emergencyContact",
      "occupation",
    ]);

    let user = req.user;
    if (Object.keys(userFields).length > 0) {
      user = await User.findByIdAndUpdate(req.user._id, userFields, {
        new: true,
        runValidators: true,
      }).select("-passwordHash -resetPasswordToken -resetPasswordExpire");
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: profileFields, $setOnInsert: { userId: req.user._id } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: "Profile updated successfully",
      data: {
        user: toSafeUser(user),
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getAvailableRooms,
  getProfile,
  getRentalHistory,
  mockPayBill,
  updateProfile,
};
