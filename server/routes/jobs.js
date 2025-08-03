import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
} from "../controllers/jobController.js";
import { protectRoute } from '../middleware/privateRoutes.js';

const router = express.Router();

router.post("/", protectRoute, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", protectRoute, updateJob);
router.delete("/:id", protectRoute, deleteJob);
router.post("/:id/apply", protectRoute, applyToJob);

export default router;
