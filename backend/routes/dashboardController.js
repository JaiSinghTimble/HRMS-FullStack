const getStats = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalCandidates: 0,
        onboarding: 0,
        leaveRequests: 0,
        openJobs: 0
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