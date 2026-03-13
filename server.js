import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectDB } from "./src/config/config.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import workspaceRoutes from "./src/routes/workSpaceRoutes.js";




dotenv.config();

const app = express();

// ===== CORS (needed for sessions) =====
const cors = require("cors");

app.use(cors({
  origin: [
    "https://rfp-track.netlify.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  credentials: true
}));



// ===== Session =====



app.use(express.json());

// ===== Health =====
app.get("/health", (_req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workspace", workspaceRoutes);

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// ===== Error =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5200;

connectDB().then(() => {
  console.log("Mongo connected");
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
