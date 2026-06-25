const mongoose = require("mongoose");
const { Schema } = mongoose;

/* =====================================================
   USER
===================================================== */
const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: String,
    avatar: String,
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "RENTER"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "LOCKED"],
      default: "ACTIVE",
    },
    lastLogin: Date,
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   USER PROFILE
===================================================== */
const UserProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    gender: String,
    dob: Date,
    address: String,
    cccd: String,
    emergencyContact: String,
    occupation: String,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   HOUSE
===================================================== */
const HouseSchema = new Schema(
  {
    houseName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: String,
    totalRooms: Number,
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   MANAGER ASSIGNMENT
===================================================== */
const ManagerAssignmentSchema = new Schema(
  {
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: Date,
    status: {
      type: String,
      enum: ["ACTIVE", "ENDED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   ROOM
===================================================== */
const RoomSchema = new Schema(
  {
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    roomCode: {
      type: String,
      unique: true,
    },
    roomNumber: String,
    floor: Number,
    area: Number,
    capacity: Number,
    rentalPrice: Number,
    depositAmount: Number,
    description: String,
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "OCCUPIED",
        "MAINTENANCE",
        "RESERVED",
      ],
      default: "AVAILABLE",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   RENTAL CONTRACT
===================================================== */
const RentalContractSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    renterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: Date,
    endDate: Date,
    monthlyRent: Number,
    depositAmount: Number,
    contractFile: String,
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "EXPIRED",
        "TERMINATED",
      ],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   ROOM MEMBER
===================================================== */
const MemberSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: "RentalContract",
    },
    fullName: String,
    gender: String,
    dob: Date,
    phone: String,
    cccd: String,
    hometown: String,
    occupation: String,
    emergencyContact: String,
    status: {
      type: String,
      enum: ["ACTIVE", "LEFT"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   EQUIPMENT
===================================================== */
const EquipmentSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    equipmentName: String,
    quantity: Number,
    condition: String,
    purchaseDate: Date,
    note: String,
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "BROKEN",
        "REPLACED",
      ],
      default: "AVAILABLE",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   SERVICE FEE
===================================================== */
const ServiceFeeSchema = new Schema(
  {
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
    },
    serviceName: String,
    unit: String,
    unitPrice: Number,
    description: String,
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   ROOM SERVICE USAGE
===================================================== */
const RoomServiceUsageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    serviceFeeId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceFee",
    },
    month: Number,
    year: Number,
    oldIndex: Number,
    newIndex: Number,
    quantity: Number,
    totalAmount: Number,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   BILL
===================================================== */
const BillSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: "RentalContract",
    },
    billMonth: Number,
    billYear: Number,
    rentAmount: Number,
    serviceAmount: Number,
    otherAmount: Number,
    totalAmount: Number,
    dueDate: Date,
    paidAt: Date,
    status: {
      type: String,
      enum: [
        "UNPAID",
        "PARTIAL",
        "PAID",
        "OVERDUE",
      ],
      default: "UNPAID",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   BILL DETAIL
===================================================== */
const BillDetailSchema = new Schema(
  {
    billId: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
    },
    itemName: String,
    quantity: Number,
    unitPrice: Number,
    amount: Number,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   PAYMENT
===================================================== */
const PaymentSchema = new Schema(
  {
    billId: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
    },
    amount: Number,
    paymentMethod: {
      type: String,
      enum: [
        "CASH",
        "BANK_TRANSFER",
      ],
    },
    paymentDate: Date,
    transactionCode: String,
    note: String,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   NEWS
===================================================== */
const NewsSchema = new Schema(
  {
    title: String,
    content: String,
    thumbnail: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "PUBLISHED",
        "HIDDEN",
      ],
      default: "DRAFT",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   COMMENT
===================================================== */
const CommentSchema = new Schema(
  {
    newsId: {
      type: Schema.Types.ObjectId,
      ref: "News",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   REPORT
===================================================== */
const ReportSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    description: String,
    images: [String],
    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
      ],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: [
        "OPEN",
        "PROCESSING",
        "RESOLVED",
        "REJECTED",
      ],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   NOTIFICATION
===================================================== */
const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    content: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   LOGIN SESSION
===================================================== */
const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    refreshToken: String,
    ipAddress: String,
    userAgent: String,
    expiredAt: Date,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   AUDIT LOG
===================================================== */
const AuditLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    action: String,
    module: String,
    entityId: String,
    oldData: Schema.Types.Mixed,
    newData: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   DASHBOARD CACHE
===================================================== */
const DashboardStatisticSchema = new Schema(
  {
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
    },
    totalRooms: Number,
    occupiedRooms: Number,
    availableRooms: Number,
    totalRevenue: Number,
    unpaidBills: Number,
    activeRenters: Number,
  },
  {
    timestamps: true,
  }
);

// Compile Models
const User = mongoose.model("User", UserSchema);
const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
const House = mongoose.model("House", HouseSchema);
const ManagerAssignment = mongoose.model("ManagerAssignment", ManagerAssignmentSchema);
const Room = mongoose.model("Room", RoomSchema);
const RentalContract = mongoose.model("RentalContract", RentalContractSchema);
const Member = mongoose.model("Member", MemberSchema);
const Equipment = mongoose.model("Equipment", EquipmentSchema);
const ServiceFee = mongoose.model("ServiceFee", ServiceFeeSchema);
const RoomServiceUsage = mongoose.model("RoomServiceUsage", RoomServiceUsageSchema);
const Bill = mongoose.model("Bill", BillSchema);
const BillDetail = mongoose.model("BillDetail", BillDetailSchema);
const Payment = mongoose.model("Payment", PaymentSchema);
const News = mongoose.model("News", NewsSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Report = mongoose.model("Report", ReportSchema);
const Notification = mongoose.model("Notification", NotificationSchema);
const Session = mongoose.model("Session", SessionSchema);
const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
const DashboardStatistic = mongoose.model("DashboardStatistic", DashboardStatisticSchema);

module.exports = {
  User,
  UserProfile,
  House,
  ManagerAssignment,
  Room,
  RentalContract,
  Member,
  Equipment,
  ServiceFee,
  RoomServiceUsage,
  Bill,
  BillDetail,
  Payment,
  News,
  Comment,
  Report,
  Notification,
  Session,
  AuditLog,
  DashboardStatistic,
};
