const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  totalLeaves: { type: Number, default: 18 },
  avatar: { type: String }
},
{ timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);