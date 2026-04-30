const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mail");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "HRMS Login OTP",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>Valid for 5 minutes</p>
      `
    });

    res.json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "OTP verified",
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};