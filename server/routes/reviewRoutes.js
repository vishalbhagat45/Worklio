import express from "express";
import {
  createReview,
  getReviewsByGig,
} from "../controllers/reviewController.js";
import { protectRoute } from "../middleware/privateRoutes.js";

const router = express.Router();

router.post("/", protectRoute, createReview);
router.get("/:gigId", getReviewsByGig);

export default router;
