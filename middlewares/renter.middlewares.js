const mongoose = require("mongoose");
const { User } = require("../db/models");

const requireRenter = async (req, res, next) => {
  try {
    const userId = req.header("x-user-id");

    if (!userId) {
      return res.status(401).json({ message: "Missing x-user-id header" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid x-user-id" });
    }

    const user = await User.findOne({
      _id: userId,
      role: "RENTER",
      status: "ACTIVE",
    }).select("-passwordHash -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(403).json({ message: "Active renter account required" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireRenter,
};
