import mongoose from "mongoose";
import Project from "../models/project.js";

// ===== Helpers =====
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const allowedSectionStatuses = ["In Progress", "Done", "Reviewed", "Closed"];

// ===== Weightage Validation =====
const validateWeightage = (sections = []) => {

  if (!Array.isArray(sections) || sections.length === 0) {
    return; // allow empty sections
  }

  const sectionTotal = sections.reduce(
    (sum, sec) => sum + (Number(sec.weightage) || 0),
    0
  );

  if (Math.round(sectionTotal) !== 100) {
    throw new Error("Total section weightage must be 100%");
  }

  for (const sec of sections) {

    if (!Array.isArray(sec.subSections) || sec.subSections.length === 0) {
      throw new Error(`Section "${sec.name}" must have subSections`);
    }

    const subTotal = sec.subSections.reduce(
      (sum, sub) => sum + (Number(sub.weightage) || 0),
      0
    );

    if (Math.round(subTotal) !== 100) {
      throw new Error(
        `SubSection weightage must equal 100% inside section "${sec.name}"`
      );
    }
  }
};

// ===== CREATE PROJECT =====
export const createProject = async (req, res) => {
  try {

    const { projectName, rfpNumber, submissionDate, sections } = req.body;

    if (!projectName || !rfpNumber || !submissionDate) {
      return res.status(400).json({
        message: "projectName, rfpNumber and submissionDate are required"
      });
    }

    if (sections && sections.length > 0) {
      validateWeightage(sections);
    }

    const project = await Project.create({
      ...req.body,
      sections: sections || []
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Project name must be unique"
      });
    }

    return res.status(500).json({
      message: error.message
    });
  }
};

// ===== BULK CREATE PROJECTS =====
export const createProjectsBulk = async (req, res) => {
  try {

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Array of projects required" });
    }

    for (const project of req.body) {
      if (project.sections && project.sections.length > 0) {
        validateWeightage(project.sections);
      }
    }

    const inserted = await Project.insertMany(req.body, { ordered: false });

    res.status(201).json({
      success: true,
      data: inserted
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===== GET ALL PROJECTS =====
export const getProjects = async (req, res) => {
  try {

    const { page = 1, limit = 20 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== GET PROJECT BY ID =====
export const getProjectById = async (req, res) => {
  try {

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== UPDATE PROJECT =====
export const updateProject = async (req, res) => {
  try {

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (req.body.sections && req.body.sections.length > 0) {
      validateWeightage(req.body.sections);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({ message: "Project name must be unique" });
    }

    res.status(400).json({ message: error.message });
  }
};

// ===== DELETE PROJECT =====
export const deleteProject = async (req, res) => {
  try {

    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== UPDATE SECTION STATUS =====
export const updateSection = async (req, res) => {
  try {

    const { projectId, sectionId } = req.params;
    const { status } = req.body;

    if (!isValidId(projectId) || !isValidId(sectionId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    if (!status || !allowedSectionStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid section status" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, "sections._id": sectionId },
      { $set: { "sections.$.status": status } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== UPDATE SUBSECTION DETAILS =====
export const updateSubSection = async (req, res) => {
  try {

    const { projectId, sectionId, subSectionId } = req.params;

    if (
      !isValidId(projectId) ||
      !isValidId(sectionId) ||
      !isValidId(subSectionId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    if (!Array.isArray(req.body.details)) {
      return res.status(400).json({ message: "details must be array" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $set: {
          "sections.$[section].subSections.$[sub].details": req.body.details
        }
      },
      {
        new: true,
        arrayFilters: [
          { "section._id": sectionId },
          { "sub._id": subSectionId }
        ]
      }
    );

    if (!project) {
      return res.status(404).json({ message: "SubSection not found" });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};