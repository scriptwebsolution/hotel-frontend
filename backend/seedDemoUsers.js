const authService = require("./src/services/authService");
const pool = require("./src/config/db");
const userModel = require("./src/models/userModel");

const demoUsers = [
  { name: "Tester", email: "tester1@gmail.com", password: "tester1@123", role: "admin" },
  { name: "Manager", email: "manager1@gmail.com", password: "manager1@123", role: "admin" },
  { name: "Cashier", email: "cashier1@gmail.com", password: "cashier1@123", role: "staff" },
];

const seed = async () => {
  console.log("Seeding demo users...");
  for (const u of demoUsers) {
    try {
      const existing = await userModel.findByEmail(u.email);
      if (!existing) {
        await authService.register(u);
        console.log(`Created: ${u.email}`);
      } else {
        console.log(`Already exists: ${u.email}`);
      }
    } catch (err) {
      console.error(`Failed to create ${u.email}:`, err.message);
    }
  }
  await pool.end();
};

seed();
