import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  getMyApplications,
  getApplicantsForGig,
  updateApplicationStatus,
} from "../controllers/jobController.js";
import { protectRoute } from '../middleware/privateRoutes.js';

const router = express.Router();

router.post("/", protectRoute, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", protectRoute, updateJob);
router.delete("/:id", protectRoute, deleteJob);
router.post("/:id/apply", protectRoute, applyToJob);
router.get("/my-applications", protectRoute, getMyApplications);
router.get("/:id/applicants", protectRoute, getApplicantsForGig);
router.put("/update-status/:applicationId", protectRoute, updateApplicationStatus); 



export default router;
