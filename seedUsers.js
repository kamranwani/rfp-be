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
        email: "admin",
        password: await bcrypt.hash("admin@2026", 10),
        role: "admin",
      },
      {
        email: "muheetaltaf",
        password: await bcrypt.hash("muheet123", 10),
        role: "uploader", // change role if needed
      }
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