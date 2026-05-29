import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    jobMatchScore: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      required: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    recommendedKeywords: {
      type: [String],
      default: [],
    },

    matchingSkills: {
      type: [String],
      default: [],
    },

    missingKeywordsFromJD: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    jobSpecificSuggestions: {
      type: [String],
      default: [],
    },

    projectSuggestions: {
      type: [String],
      default: [],
    },

    formattingIssues: {
      type: [String],
      default: [],
    },

    rawText: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;