const mongoose = require("mongoose");

const onboardSchema = new mongoose.Schema(
{
  name: String,
  email: String,
  phone: String,
  position: String,
  ctc: String,
  doj: String,
  bgv: {
    type: String,
    default: "Pending"
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Onboard", onboardSchema);