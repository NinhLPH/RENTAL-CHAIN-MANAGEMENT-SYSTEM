const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const {
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
} = require("../db/models");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/SDN_Mini";
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully. Cleaning old data...");

    // Clear all existing data
    await User.deleteMany({});
    await UserProfile.deleteMany({});
    await House.deleteMany({});
    await ManagerAssignment.deleteMany({});
    await Room.deleteMany({});
    await RentalContract.deleteMany({});
    await Member.deleteMany({});
    await Equipment.deleteMany({});
    await ServiceFee.deleteMany({});
    await RoomServiceUsage.deleteMany({});
    await Bill.deleteMany({});
    await BillDetail.deleteMany({});
    await Payment.deleteMany({});
    await News.deleteMany({});
    await Comment.deleteMany({});
    await Report.deleteMany({});
    await Notification.deleteMany({});
    await Session.deleteMany({});
    await AuditLog.deleteMany({});
    await DashboardStatistic.deleteMany({});

    console.log("Database cleared. Generating seed data...");

    // 1. Hash Passwords
    const defaultPassword = "password123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // 2. Seed Users
    const users = await User.insertMany([
      {
        fullName: "Nguyen Van Admin",
        email: "admin@rental.com",
        passwordHash,
        phone: "0912345678",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
        role: "ADMIN",
        status: "ACTIVE",
        lastLogin: new Date(),
      },
      {
        fullName: "Tran Thi Manager A",
        email: "manager.a@rental.com",
        passwordHash,
        phone: "0987654321",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=managerA",
        role: "MANAGER",
        status: "ACTIVE",
        lastLogin: new Date(),
      },
      {
        fullName: "Le Van Renter A",
        email: "renter.a@rental.com",
        passwordHash,
        phone: "0901234567",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=renterA",
        role: "RENTER",
        status: "ACTIVE",
        lastLogin: new Date(),
      },
      {
        fullName: "Pham Thi Renter B",
        email: "renter.b@rental.com",
        passwordHash,
        phone: "0934567890",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=renterB",
        role: "RENTER",
        status: "ACTIVE",
        lastLogin: new Date(),
      },
    ]);

    const admin = users[0];
    const manager = users[1];
    const renterA = users[2];
    const renterB = users[3];

    // 3. Seed User Profiles
    await UserProfile.insertMany([
      {
        userId: admin._id,
        gender: "Male",
        dob: new Date("1990-01-01"),
        address: "123 Ba Trieu, Hai Ba Trung, Ha Noi",
        cccd: "001090123456",
        emergencyContact: "0912233445 (Vo)",
        occupation: "System Administrator",
      },
      {
        userId: manager._id,
        gender: "Female",
        dob: new Date("1992-05-15"),
        address: "456 Tran Hung Dao, Hoan Kiem, Ha Noi",
        cccd: "001092654321",
        emergencyContact: "0987766554 (Chong)",
        occupation: "Property Manager",
      },
      {
        userId: renterA._id,
        gender: "Male",
        dob: new Date("1998-10-20"),
        address: "789 Lang, Dong Da, Ha Noi",
        cccd: "001098877665",
        emergencyContact: "0901122334 (Bo)",
        occupation: "Software Engineer",
      },
      {
        userId: renterB._id,
        gender: "Female",
        dob: new Date("2000-03-25"),
        address: "101 Xuan Thuy, Cau Giay, Ha Noi",
        cccd: "001100554433",
        emergencyContact: "0934433221 (Me)",
        occupation: "Marketing Executive",
      },
    ]);

    // 4. Seed Houses
    const houses = await House.insertMany([
      {
        houseName: "Blue Ocean Apartment",
        address: "No 12, Lane 102 Nguyen Van Truong, Ha Dong, Ha Noi",
        description: "A luxury apartment building with 5 floors and elevator.",
        totalRooms: 10,
        managerId: manager._id,
        status: "ACTIVE",
      },
      {
        houseName: "Green Valley House",
        address: "No 56, Alley 42 Tran Thai Tong, Cau Giay, Ha Noi",
        description: "Cozy rooms near major universities.",
        totalRooms: 8,
        managerId: manager._id,
        status: "ACTIVE",
      },
    ]);

    const houseA = houses[0];
    const houseB = houses[1];

    // 5. Seed Manager Assignments
    await ManagerAssignment.insertMany([
      {
        houseId: houseA._id,
        managerId: manager._id,
        assignedBy: admin._id,
        assignedAt: new Date("2026-01-01"),
        status: "ACTIVE",
      },
      {
        houseId: houseB._id,
        managerId: manager._id,
        assignedBy: admin._id,
        assignedAt: new Date("2026-02-15"),
        status: "ACTIVE",
      },
    ]);

    // 6. Seed Rooms
    const rooms = await Room.insertMany([
      {
        houseId: houseA._id,
        roomCode: "BO-101",
        roomNumber: "101",
        floor: 1,
        area: 25,
        capacity: 2,
        rentalPrice: 3500000,
        depositAmount: 3500000,
        description: "Studio room with window, fully furnished.",
        status: "OCCUPIED",
      },
      {
        houseId: houseA._id,
        roomCode: "BO-102",
        roomNumber: "102",
        floor: 1,
        area: 30,
        capacity: 3,
        rentalPrice: 4200000,
        depositAmount: 4200000,
        description: "1-bedroom apartment, balcony, spacious.",
        status: "AVAILABLE",
      },
      {
        houseId: houseB._id,
        roomCode: "GV-201",
        roomNumber: "201",
        floor: 2,
        area: 20,
        capacity: 2,
        rentalPrice: 2800000,
        depositAmount: 2800000,
        description: "Small clean room with mezzanine.",
        status: "OCCUPIED",
      },
      {
        houseId: houseB._id,
        roomCode: "GV-202",
        roomNumber: "202",
        floor: 2,
        area: 22,
        capacity: 2,
        rentalPrice: 3000000,
        depositAmount: 3000000,
        description: "Room with private bathroom and kitchen corner.",
        status: "MAINTENANCE",
      },
    ]);

    const roomBO101 = rooms[0];
    const roomBO102 = rooms[1];
    const roomGV201 = rooms[2];
    const roomGV202 = rooms[3];

    // 7. Seed Rental Contracts
    const contracts = await RentalContract.insertMany([
      {
        roomId: roomBO101._id,
        renterId: renterA._id,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2027-01-01"),
        monthlyRent: 3500000,
        depositAmount: 3500000,
        contractFile: "contracts/BO-101-contract.pdf",
        status: "ACTIVE",
      },
      {
        roomId: roomGV201._id,
        renterId: renterB._id,
        startDate: new Date("2026-03-01"),
        endDate: new Date("2027-03-01"),
        monthlyRent: 2800000,
        depositAmount: 2800000,
        contractFile: "contracts/GV-201-contract.pdf",
        status: "ACTIVE",
      },
    ]);

    const contractA = contracts[0];
    const contractB = contracts[1];

    // 8. Seed Room Members
    await Member.insertMany([
      {
        roomId: roomBO101._id,
        contractId: contractA._id,
        fullName: "Le Van Renter A",
        gender: "Male",
        dob: new Date("1998-10-20"),
        phone: "0901234567",
        cccd: "001098877665",
        hometown: "Thanh Hoa",
        occupation: "Software Engineer",
        emergencyContact: "0901122334 (Bo)",
        status: "ACTIVE",
      },
      {
        roomId: roomBO101._id,
        contractId: contractA._id,
        fullName: "Nguyen Van Friend",
        gender: "Male",
        dob: new Date("1998-05-12"),
        phone: "0907766554",
        cccd: "001098554433",
        hometown: "Nghe An",
        occupation: "Designer",
        emergencyContact: "0907766550 (Me)",
        status: "ACTIVE",
      },
      {
        roomId: roomGV201._id,
        contractId: contractB._id,
        fullName: "Pham Thi Renter B",
        gender: "Female",
        dob: new Date("2000-03-25"),
        phone: "0934567890",
        cccd: "001100554433",
        hometown: "Hai Phong",
        occupation: "Marketing Executive",
        emergencyContact: "0934433221 (Me)",
        status: "ACTIVE",
      },
    ]);

    // 9. Seed Equipment
    await Equipment.insertMany([
      {
        roomId: roomBO101._id,
        equipmentName: "Air Conditioner Daikin 9000BTU",
        quantity: 1,
        condition: "Excellent",
        purchaseDate: new Date("2025-12-10"),
        note: "Remote placed on the wall holder",
        status: "AVAILABLE",
      },
      {
        roomId: roomBO101._id,
        equipmentName: "Fridge Panasonic 150L",
        quantity: 1,
        condition: "Good",
        purchaseDate: new Date("2025-12-12"),
        note: "Defrost annually",
        status: "AVAILABLE",
      },
      {
        roomId: roomGV201._id,
        equipmentName: "Air Conditioner LG 9000BTU",
        quantity: 1,
        condition: "Good",
        purchaseDate: new Date("2026-02-20"),
        note: "Requires filter cleaning every 6 months",
        status: "AVAILABLE",
      },
      {
        roomId: roomGV202._id,
        equipmentName: "Water Heater Ariston 20L",
        quantity: 1,
        condition: "Broken - heating element failure",
        purchaseDate: new Date("2024-05-05"),
        note: "Scheduled for repair/replacement",
        status: "BROKEN",
      },
    ]);

    // 10. Seed Service Fees
    const serviceFees = await ServiceFee.insertMany([
      {
        houseId: houseA._id,
        serviceName: "Electricity",
        unit: "kWh",
        unitPrice: 3500,
        description: "Room electricity usage via separate sub-meter",
        status: "ACTIVE",
      },
      {
        houseId: houseA._id,
        serviceName: "Water",
        unit: "m3",
        unitPrice: 25000,
        description: "Clean tap water per cubic meter",
        status: "ACTIVE",
      },
      {
        houseId: houseA._id,
        serviceName: "Internet & Management",
        unit: "room/month",
        unitPrice: 150000,
        description: "High speed fiber wifi and trash collection fee",
        status: "ACTIVE",
      },
      {
        houseId: houseB._id,
        serviceName: "Electricity",
        unit: "kWh",
        unitPrice: 3800,
        description: "Room electricity usage",
        status: "ACTIVE",
      },
      {
        houseId: houseB._id,
        serviceName: "Water",
        unit: "person/month",
        unitPrice: 100000,
        description: "Flat rate water fee per resident",
        status: "ACTIVE",
      },
    ]);

    const feeBOElectric = serviceFees[0];
    const feeBOWater = serviceFees[1];
    const feeBOInternet = serviceFees[2];
    const feeGVElectric = serviceFees[3];
    const feeGVWater = serviceFees[4];

    // 11. Seed Room Service Usages (e.g. for May 2026)
    const serviceUsages = await RoomServiceUsage.insertMany([
      {
        roomId: roomBO101._id,
        serviceFeeId: feeBOElectric._id,
        month: 5,
        year: 2026,
        oldIndex: 1200,
        newIndex: 1350,
        quantity: 150,
        totalAmount: 150 * 3500, // 525,000
      },
      {
        roomId: roomBO101._id,
        serviceFeeId: feeBOWater._id,
        month: 5,
        year: 2026,
        oldIndex: 340,
        newIndex: 348,
        quantity: 8,
        totalAmount: 8 * 25000, // 200,000
      },
      {
        roomId: roomBO101._id,
        serviceFeeId: feeBOInternet._id,
        month: 5,
        year: 2026,
        quantity: 1,
        totalAmount: 150000, // 150,000
      },
      {
        roomId: roomGV201._id,
        serviceFeeId: feeGVElectric._id,
        month: 5,
        year: 2026,
        oldIndex: 850,
        newIndex: 930,
        quantity: 80,
        totalAmount: 80 * 3800, // 304,000
      },
      {
        roomId: roomGV201._id,
        serviceFeeId: feeGVWater._id,
        month: 5,
        year: 2026,
        quantity: 1, // 1 person flat rate
        totalAmount: 100000,
      },
    ]);

    // 12. Seed Bills
    const bills = await Bill.insertMany([
      {
        roomId: roomBO101._id,
        contractId: contractA._id,
        billMonth: 5,
        billYear: 2026,
        rentAmount: 3500000,
        serviceAmount: 525000 + 200000 + 150000, // 875,000
        otherAmount: 0,
        totalAmount: 3500000 + 875000, // 4,375,000
        dueDate: new Date("2026-06-05"),
        status: "PAID",
        paidAt: new Date("2026-06-03"),
      },
      {
        roomId: roomGV201._id,
        contractId: contractB._id,
        billMonth: 5,
        billYear: 2026,
        rentAmount: 2800000,
        serviceAmount: 304000 + 100000, // 404,000
        otherAmount: 0,
        totalAmount: 2800000 + 404000, // 3,204,000
        dueDate: new Date("2026-06-05"),
        status: "UNPAID",
      },
    ]);

    const billBO = bills[0];
    const billGV = bills[1];

    // 13. Seed Bill Details
    await BillDetail.insertMany([
      // Bill BO Details
      {
        billId: billBO._id,
        itemName: "Monthly Room Rent",
        quantity: 1,
        unitPrice: 3500000,
        amount: 3500000,
      },
      {
        billId: billBO._id,
        itemName: "Electricity Usage (150 kWh)",
        quantity: 150,
        unitPrice: 3500,
        amount: 525000,
      },
      {
        billId: billBO._id,
        itemName: "Water Usage (8 m3)",
        quantity: 8,
        unitPrice: 25000,
        amount: 200000,
      },
      {
        billId: billBO._id,
        itemName: "Internet & Management Fee",
        quantity: 1,
        unitPrice: 150000,
        amount: 150000,
      },
      // Bill GV Details
      {
        billId: billGV._id,
        itemName: "Monthly Room Rent",
        quantity: 1,
        unitPrice: 2800000,
        amount: 2800000,
      },
      {
        billId: billGV._id,
        itemName: "Electricity Usage (80 kWh)",
        quantity: 80,
        unitPrice: 3800,
        amount: 304000,
      },
      {
        billId: billGV._id,
        itemName: "Flat Rate Water (1 Person)",
        quantity: 1,
        unitPrice: 100000,
        amount: 100000,
      },
    ]);

    // 14. Seed Payments (for paid bills)
    await Payment.insertMany([
      {
        billId: billBO._id,
        amount: 4375000,
        paymentMethod: "BANK_TRANSFER",
        paymentDate: new Date("2026-06-03"),
        transactionCode: "FT26155982763",
        note: "BO-101 Payment Rent Month 5",
      },
    ]);

    // 15. Seed News
    const newsList = await News.insertMany([
      {
        title: "Welcome to Our Rental Management System!",
        content: "We are pleased to introduce our brand new app to help manage rooms, service usages, payments, and support requests effortlessly.",
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=300",
        createdBy: admin._id,
        status: "PUBLISHED",
      },
      {
        title: "Upcoming Fire Safety Drill",
        content: "Please be noted that there will be a fire safety drill conducted at Blue Ocean Apartment on Sunday, July 5th, 2026. Cooperation is appreciated.",
        thumbnail: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=300",
        createdBy: manager._id,
        status: "PUBLISHED",
      },
    ]);

    // 16. Seed Comments
    await Comment.insertMany([
      {
        newsId: newsList[0]._id,
        userId: renterA._id,
        content: "Awesome system! The interface looks clean and payment is very easy.",
      },
      {
        newsId: newsList[1]._id,
        userId: renterA._id,
        content: "Got it. Will make sure we are present.",
      },
    ]);

    // 17. Seed Reports (Maintenance/Tickets)
    await Report.insertMany([
      {
        roomId: roomBO101._id,
        createdBy: renterA._id,
        title: "Bathroom light bulb blinking",
        description: "The main LED tube light in the bathroom is flickering and needs replacement.",
        images: ["reports/lights.jpg"],
        priority: "LOW",
        status: "RESOLVED",
      },
      {
        roomId: roomGV201._id,
        createdBy: renterB._id,
        title: "Water leaking under kitchen sink",
        description: "Water starts dripping heavily whenever the faucet is turned on. Need assistance urgently.",
        images: ["reports/leak.png"],
        priority: "HIGH",
        status: "OPEN",
      },
    ]);

    // 18. Seed Notifications
    await Notification.insertMany([
      {
        userId: renterA._id,
        title: "Payment Received",
        content: "Your payment of 4,375,000 VND for bill of Month 5 has been verified successfully.",
        isRead: true,
      },
      {
        userId: renterB._id,
        title: "New Bill Issued",
        content: "Your monthly bill for Month 5 has been generated. Due date is 2026-06-05.",
        isRead: false,
      },
    ]);

    // 19. Seed Sessions
    await Session.insertMany([
      {
        userId: renterA._id,
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyRefreshTokenForRenterA",
        ipAddress: "192.168.1.10",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        expiredAt: new Date("2026-07-25"),
      },
    ]);

    // 20. Seed Audit Logs
    await AuditLog.insertMany([
      {
        userId: admin._id,
        action: "ASSIGN_MANAGER",
        module: "ManagerAssignment",
        entityId: manager._id.toString(),
        oldData: null,
        newData: { houseId: houseA._id, managerId: manager._id, status: "ACTIVE" },
      },
      {
        userId: manager._id,
        action: "UPDATE_ROOM_STATUS",
        module: "Room",
        entityId: roomBO101._id.toString(),
        oldData: { status: "AVAILABLE" },
        newData: { status: "OCCUPIED" },
      },
    ]);

    // 21. Seed Dashboard Cache
    await DashboardStatistic.insertMany([
      {
        houseId: houseA._id,
        totalRooms: 10,
        occupiedRooms: 1,
        availableRooms: 9,
        totalRevenue: 4375000,
        unpaidBills: 0,
        activeRenters: 2,
      },
      {
        houseId: houseB._id,
        totalRooms: 8,
        occupiedRooms: 1,
        availableRooms: 7,
        totalRevenue: 0,
        unpaidBills: 1,
        activeRenters: 1,
      },
    ]);

    console.log("=========================================");
    console.log("Database seeded successfully!");
    console.log("Credentials for login (All passwords are 'password123'):");
    console.log("- Admin: admin@rental.com");
    console.log("- Manager: manager.a@rental.com");
    console.log("- Renter A: renter.a@rental.com");
    console.log("- Renter B: renter.b@rental.com");
    console.log("=========================================");
  } catch (error) {
    console.error("Error seeding database: ", error);
  } finally {
    await mongoose.connection.close();
    console.log("Mongoose connection closed.");
  }
};

seedDatabase();
