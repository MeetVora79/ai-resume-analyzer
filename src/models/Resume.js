import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "demo-user",
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileKey: {
      type: String,
      required: false,
    },

    fileSize: {
      type: Number,
      required: false,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescription: {
      type: String,
      required: false,
      trim: true,
    },

    status: {
      type: String,
      enum: ["uploaded", "analyzing", "completed", "failed"],
      default: "uploaded",
    },
  },
  { timestamps: true },
);

const Resume = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);

export default Resume;
