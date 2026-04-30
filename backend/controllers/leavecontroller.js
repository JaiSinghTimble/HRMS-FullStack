const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

exports.addEmployee = async (req, res) => {
  try {
    const { name, role, department, totalLeaves } = req.body;

    const avatar = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const employee = await Employee.create({
      name,
      role,
      department,
      totalLeaves,
      avatar,
    });

    res.json({
      success: true,
      employee,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      employees,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    // ✅ Normalize date (THIS IS THE FIX)
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    const record = await Attendance.findOneAndUpdate(
      {
        employeeId,
        date: formattedDate,
      },
      {
        employeeId,
        date: formattedDate,
        status,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      record,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { id } = req.params; // ✅ FIXED

    const records = await Attendance.find({
      employeeId: id,
    });

    res.json({
      success: true,
attendance: records,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};