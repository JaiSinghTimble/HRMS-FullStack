const Candidate = require("../models/Candidate");
const Job = require("../models/Job");

const getStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const selected = await Candidate.countDocuments({ status: "Selected" });
    const rejected = await Candidate.countDocuments({ status: "Rejected" });
    const openJobs = await Job.countDocuments({ status: "Open" });

    const pending = totalCandidates - selected - rejected;

    res.json({
      success: true,
      data: {   
        totalCandidates,
        selected,
        rejected,
        openJobs,

        hiringTrends: [
          { month: "Jan", candidates: 5 },
          { month: "Feb", candidates: 8 },
          { month: "Mar", candidates: 12 },
          { month: "Apr", candidates: 10 },
          { month: "May", candidates: totalCandidates }
        ],

        distribution: [
          { name: "Selected", value: selected },
          { name: "Rejected", value: rejected },
          { name: "Pending", value: pending }
        ],

        recentActivity: [
          "Rahul moved to Round 2",
          "Aman rejected",
          "Priya selected"
        ],

        pipeline: {
          applied: 90,
          interview: 60,
          offer: 30
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getStats };