const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  currentlyWorking: {
    type: Boolean,
    required: true,
    default: true,
  },
  featured: {
    type: Boolean,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  currentPosition: {
    type: String,
    required: true,
  },
  previousPositions: {
    type: [String],
    required: false,
    default: [],
  },
  roleType: {
    type: String,
    enum: [
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
      "Freelance",
      "Temporary",
      "Remote",
      "Onsite",
      "Hybrid",
    ],
    required: true,
    message: "Invalid role type",
  },
  description: {
    type: [String],
    required: true,
    default: [],
  },
  skills: {
    type: [String],
    required: true,
    default: [],
  },
});
experienceSchema.index({ currentlyWorking: -1, startDate: -1, endDate: -1 });

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;
