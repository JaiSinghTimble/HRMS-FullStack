const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const onboardRoutes = require("./routes/onboardRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/onboard", onboardRoutes);
app.use("/api/job", jobRoutes);

app.get("/", (req, res) => {
  res.send("HRMS Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});