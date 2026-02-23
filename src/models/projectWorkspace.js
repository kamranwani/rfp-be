import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  documentName: {
    type: String,
    required: true
  },

  format: String,

  version: String, // ⭐ from UI

  uploadedBy: String,

  uploadDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "pending"
  }

}, { _id: true });

const projectWorkspaceSchema = new mongoose.Schema({

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    unique: true
  },

  client: String, // ⭐ from UI

  submissionDeadline: Date,

  overallProgress: Number, // percentage

  assignedTeam: [String],

  projectManager: String, // ⭐ label in UI

  priority: {
    type: String,
    enum: ["low", "easy", "moderate", "high", "critical"],
    default: "moderate"
  },

  stage: {
    type: String,
    enum: ["draft", "in review", "completed", "approved"],
    default: "in review"
  },

  uploads: [uploadSchema]

}, { timestamps: true });

export default mongoose.model("ProjectWorkspace", projectWorkspaceSchema);
