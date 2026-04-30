const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
{
  role: String,
  category: String,
  location: String,
  type: String,
  experience: String,
  about: String,
  responsibilities: [String],
  requirements: [String],

  status: {
    type: String,
    default: "Open"
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Job", jobSchema);