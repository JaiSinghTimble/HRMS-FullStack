const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployees,
  markAttendance,
  getAttendance
} = require("../controllers/leaveController");

// Employees
router.post("/add-employee", addEmployee);
router.get("/employees", getEmployees);

// Attendance
router.post("/mark-attendance", markAttendance);
router.get("/attendance/:id", getAttendance);

module.exports = router;