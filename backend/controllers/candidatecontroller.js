const Candidate = require("../models/Candidate");
const transporter = require("../config/mail");

exports.applyCandidate = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      position,
      experience,
      notice,
      currentCTC,
      expectedCTC,
      linkedIn,
      portfolio,
      coverLetter
    } = req.body;

    const candidate = await Candidate.create({
      fullName,
      email,
      phone,
      position,
      experience,
      notice,
      currentCTC,
      expectedCTC,
      linkedIn,
      portfolio,
      coverLetter,
      resume: req.file ? req.file.filename : ""
    });

    res.json({
      success: true,
      message: "Application Submitted",
      candidate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      candidates
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.processCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    candidate.status = "Shortlisted";
    await candidate.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: "Application Update from Timble.ai",
      html: `
        <h3>Dear ${candidate.fullName},</h3>
        <p>Thank you for applying at Timble.ai.</p>
        <p>We are pleased to inform you that your profile has been shortlisted for the next stage of our hiring process.</p>
        <p>Our HR team will contact you soon regarding the next steps.</p>
        <br/>
        <p>Best Regards,</p>
        <p><b>Timble.ai Hiring Team</b></p>
      `
    });

    res.json({
      success: true,
      message: "Candidate processed successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.rejectCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    candidate.status = "Rejected";
    await candidate.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: "Application Status - Timble.ai",
      html: `
        <h3>Dear ${candidate.fullName},</h3>
        <p>Thank you for your interest in Timble.ai.</p>
        <p>After careful review, we regret to inform you that we will not be proceeding further at this time.</p>
        <p>We appreciate your time and wish you success ahead.</p>
        <br/>
        <p>Regards,</p>
        <p><b>Timble.ai Hiring Team</b></p>
      `
    });

    res.json({
      success: true,
      message: "Candidate rejected successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};