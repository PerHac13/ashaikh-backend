const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: [String],
    required: false,
  },
  madeAt: {
    type: String,
    required: false,
    default: "",
  },
  imagePath: {
    type: String,
    required: false,
    default:
      "https://res.cloudinary.com/dmknbak4t/image/upload/v1739515347/pexels-luis-gomes-166706-546819_vr4jlv.jpg",
  },
  link: {
    type: [String],
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
  },
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
    required: false,
    default: false,
  },
  description: {
    type: [String],
    required: true,
  },
  skill: {
    type: [String],
    required: true,
  },
  score: {
    type: Number,
    required: false,
    default: 0,
  },
});

projectSchema.index({
  currentlyWorking: -1,
  startDate: -1,
  endDate: -1,
  score: -1,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
