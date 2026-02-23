import express from "express";
import {
  createWorkspace,
  getWorkspaceByProject,
  updateWorkspace,
  deleteWorkspace,
  addUpload,
  updateUpload,
  deleteUpload
} from "../controllers/workSpaceController.js";

import { requireLogin, requireAnyRole } from "../middlewares/auth.js";

const router = express.Router();

// must be logged in
router.use(requireLogin);

// ⭐ allow admin + uploader full access
router.use(requireAnyRole(["admin", "uploader"]));

// workspace CRUD
router.post("/", createWorkspace);
router.get("/:projectId", getWorkspaceByProject);
router.put("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);

// uploads CRUD
router.post("/:id/upload", addUpload);
router.patch("/:id/upload/:uploadId", updateUpload);
router.delete("/:id/upload/:uploadId", deleteUpload);

export default router;
    