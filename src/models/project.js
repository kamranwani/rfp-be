import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema(
  {
    weightage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    details: {
      type: [String],
      default: [],
    },
  },
  { _id: true }
);

const projectSectionsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    weightage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["In Progress", "Done", "Reviewed", "Closed"],
      default: "In Progress",
    },
    subSections: {
      type: [subSectionSchema],
      default: [],
    },
  },
  { _id: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    rfpNumber: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "review", "submitted", "approved"],
      default: "draft",
    },

    assignedTo: {
      type: String,
      required: true,
      trim: true,
    },

    reviewedBy: {
      type: String,
      required: true,
      trim: true,
    },

    tenderSubDate: {
      type: Date,
      required: true,
    },

    binBondValue: {
      type: Date,
      required: true,
    },

    technicalSubmission: {
      type: Date,
      required: true,
    },

    commercialSubmission: {
      type: Date,
      required: true,
    },

    surveyEngineer: {
      type: String,
      required: true,
      trim: true,
    },

    surveyReport: {
      type: String,
      required: true,
      trim: true,
    },

    sections: {
      type: [projectSectionsSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
