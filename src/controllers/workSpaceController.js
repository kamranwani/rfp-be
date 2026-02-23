import Workspace from "../models/projectWorkspace.js";

// CREATE
export const createWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.create(req.body);
    res.status(201).json(workspace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET by project
export const getWorkspaceByProject = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      projectId: req.params.projectId
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE metadata
export const updateWorkspace = async (req, res) => {
  try {
    const allowedFields = [
      "client",
      "submissionDeadline",
      "overallProgress",
      "assignedTeam",
      "projectManager",
      "priority",
      "stage"
    ];

    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    res.json(workspace);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// DELETE workspace
export const deleteWorkspace = async (req, res) => {
  try {
    await Workspace.findByIdAndDelete(req.params.id);
    res.json({ message: "Workspace deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD document
export const addUpload = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $push: { uploads: req.body } },
      { new: true }
    );

    res.json(workspace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE document
export const updateUpload = async (req, res) => {
  try {
    const updates = {};

    // dynamically build update fields
    Object.keys(req.body).forEach(key => {
      updates[`uploads.$[u].${key}`] = req.body[key];
    });

    const workspace = await Workspace.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updates },
      {
        new: true,
        arrayFilters: [{ "u._id": req.params.uploadId }]
      }
    );

    if (!workspace) {
      return res.status(404).json({ message: "Upload not found" });
    }

    res.json(workspace);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// DELETE document
export const deleteUpload = async (req, res) => {
  try {
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.id,
      { $pull: { uploads: { _id: req.params.uploadId } } },
      { new: true }
    );

    res.json(workspace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
