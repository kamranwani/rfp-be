import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema(
{
  weightage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  details: {
    type: [String],
    default: []
  }
},
{ _id: true }
);

const projectSectionsSchema = new mongoose.Schema(
{
  name: {
    type: String,
    trim: true,
    default: ""
  },

  weightage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  status: {
    type: String,
    enum: ["In Progress", "Done", "Reviewed", "Closed"],
    default: "In Progress"
  },

  subSections: {
    type: [subSectionSchema],
    default: []
  }
},
{ _id: true }
);

const ProjectSchema = new mongoose.Schema(
{
  projectName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  rfpNumber: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum: ["draft", "review", "submitted", "approved"],
    default: "draft"
  },

  receivedDate: {
    type: Date,
    default: Date.now
  },

 tenderSubDate: {
  type: Date,
  required: true
},

  assignedTo: {
    type: String,
    default: ""
  },

  reviewedBy: {
    type: String,
    default: ""
  },

  binBondValue: {
    type: Date,
    default: null
  },

  technicalSubmission: {
    type: Date,
    default: null
  },

  commercialSubmission: {
    type: Date,
    default: null
  },

  surveyEngineer: {
    type: String,
    default: ""
  },

  surveyReport: {
    type: String,
    default: ""
  },

  sections: {
    type: [projectSectionsSchema],
    default: []
  }
},
{ timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);