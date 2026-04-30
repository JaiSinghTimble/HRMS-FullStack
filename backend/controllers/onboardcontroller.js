const Onboard = require("../models/Onboard");
const Candidate = require("../models/Candidate");

exports.moveToOnboard = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    const already = await Onboard.findOne({
      email: candidate.email
    });

  if (already) {
  // 🔥 STILL update candidate status
  candidate.status = "Onboarded";
  await candidate.save();

  return res.json({
    success: true,
    message: "Already in onboarding"
  });
}

    await Onboard.create({
      name: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      ctc: candidate.expectedCTC,
      doj: "",
      bgv: "Pending"
    });

    res.json({
      success: true,
      message: "Moved to onboarding"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOnboard = async (req, res) => {
  try {
    const data = await Onboard.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};