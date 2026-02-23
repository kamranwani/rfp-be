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
import { requireLogin, requireRole } from "../middlewares/auth.js";

const router = express.Router();
router.use(requireLogin);
router.use(requireRole("admin"));

router.post("/", createProject);
router.post("/add-all", createProjectsBulk);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.patch("/:projectId/sections/:sectionId", updateSection);
router.patch(
  "/:projectId/sections/:sectionId/subsections/:subSectionId",
  updateSubSection
);

export default router;
