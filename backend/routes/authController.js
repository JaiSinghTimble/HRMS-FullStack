const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const User = require("../models/User");
const transporter = require("../config/mail");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 40 * 1000)
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "HRMS Login OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({
      success: true,
      message: "OTP Sent"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP Expired"
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: "HR Admin",
        role: "admin"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    await Otp.deleteMany({ email });

    res.json({
      success: true,
      token,
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};