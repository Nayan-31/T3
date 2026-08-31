const jobApplicationModel = require("../models/jobApplication.model.js");

const getDashboard = async (req, res) => {
  try {
    const result = jobApplicationModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
          interview: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "INTERVIEW"],
                },
                1,
                0,
              ],
            },
          },
          offers: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "OFFER"],
                },
                1,
                0,
              ],
            },
          },
          rejected: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "REJECTED"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    res.json(
      result[0] || {
        total: 0,
        interview: 0,
        offers: 0,
        rejected: 0,
      },
    );
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch dashboard",
    });
  }
};

module.exports = { getDashboard };
