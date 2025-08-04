import express from "express";
import {
  createReview,
  getReviewsByGig,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protectRoute } from "../middleware/privateRoutes.js";

const router = express.Router();

router.post("/", protectRoute, createReview);
router.get("/:gigId", getReviewsByGig);
router.put("/:id", protectRoute, updateReview);
router.delete("/:id", protectRoute, deleteReview);

export default router;
