const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"],
      default: "APPLIED",
      index: true,
    },

    type: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
      default: "FULL_TIME",
    },

    location: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.index({
  userId: 1,
  status: 1,
});

jobApplicationSchema.index({
  userId: 1,
  company: 1,
});

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);
