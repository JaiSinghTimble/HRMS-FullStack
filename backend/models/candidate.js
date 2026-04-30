const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
{
  fullName: String,
  email: String,
  phone: String,
  position: String,
  experience: String,
  notice: String,
  currentCTC: String,
  expectedCTC: String,
  linkedIn: String,
  portfolio: String,
  coverLetter: String,
  remarks: String,

  resume: String,

  status: {
    type: String,
    default: "Applied"
  },

  round: {
    type: String,
    default: "Round 1"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);