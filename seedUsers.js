import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/user.js";
import { connectDB } from "./src/config/config.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany(); // optional — clears existing users

    const users = [
      {
        email: "admin@test.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        email: "admin2@test.com",
        password: await bcrypt.hash("admin456", 10),
        role: "admin",
      },
      {
        email: "uploader@test.com",
        password: await bcrypt.hash("upload123", 10),
        role: "uploader",
      },
    ];

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedUsers();
