import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateSection,
  updateSubSection,
  createProjectsBulk
} from "../controllers/projectController.js";

import { requireLogin, requireRole, requireAnyRole } from "../middlewares/auth.js";

const router = express.Router();

router.use(requireLogin);

// ================= ADMIN ONLY =================

router.post("/", requireRole("admin"), createProject);
router.post("/add-all", requireRole("admin"), createProjectsBulk);
router.put("/:id", requireRole("admin"), updateProject);
router.delete("/:id", requireRole("admin"), deleteProject);
router.patch("/:projectId/sections/:sectionId", requireRole("admin"), updateSection);
router.patch(
  "/:projectId/sections/:sectionId/subsections/:subSectionId",
  requireRole("admin"),
  updateSubSection
);

// ================= VIEW (ADMIN + UPLOADER) =================

router.get(
  "/",
  requireAnyRole(["admin", "uploader"]),
  getProjects
);

router.get(
  "/:id",
  requireAnyRole(["admin", "uploader"]),
  getProjectById
);

export default router;