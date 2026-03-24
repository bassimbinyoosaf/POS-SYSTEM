require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const machineRoutes = require("./routes/machineRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

const path = require("path");

/* ---------- ENV VALIDATION ---------- */
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in .env");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

/* ---------- SECURITY MIDDLEWARE ---------- */
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

app.use(express.json());

/* ---------- RATE LIMITING ---------- */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Try later." }
});

app.use("/api/auth/login", loginLimiter);

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/events", eventRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- START SERVER ---------- */
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

console.log("JWT_SECRET:", process.env.JWT_SECRET);