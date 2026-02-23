import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MongoURI) {
      throw new Error("MongoURI is missing in .env");
    }

    await mongoose.connect(process.env.MongoURI, {
      dbName: "DB-RFA",
    });

    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Error occurred while connecting to MongoDB", err);
    process.exit(1);
  }
};
