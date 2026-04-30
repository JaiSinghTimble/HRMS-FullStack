const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.json({
      success: true,
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOpenJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "Open"
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};