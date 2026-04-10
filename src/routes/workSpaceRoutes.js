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

import { requireLogin, requireAnyRole, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// must be logged in
router.use(requireLogin);

// ================= WORKSPACE =================

// 👑 ADMIN ONLY
router.post("/", requireRole("admin"), createWorkspace);
router.put("/:id", requireRole("admin"), updateWorkspace);
router.delete("/:id", requireRole("admin"), deleteWorkspace);

// 👀 VIEW (admin + uploader)
router.get(
  "/:projectId",
  requireAnyRole(["admin", "uploader"]),
  getWorkspaceByProject
);

// ================= UPLOADS =================

// 📤 upload (admin + uploader)
router.post(
  "/:id/upload",
  requireAnyRole(["admin", "uploader"]),
  addUpload
);

// ❌ uploader CANNOT edit/delete uploads
router.patch(
  "/:id/upload/:uploadId",
  requireRole("admin"),
  updateUpload
);

router.delete(
  "/:id/upload/:uploadId",
  requireRole("admin"),
  deleteUpload
);

export default router;