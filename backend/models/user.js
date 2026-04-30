const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  email: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    default: "HR Admin"
  },

  role: {
    type: String,
    default: "admin"
  },

  isActive: {
    type: Boolean,
    default: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);