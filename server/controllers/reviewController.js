import Review from "../models/Review.js";
import Job from "../models/Job.js";
import Order from "../models/Order.js";

export const createReview = async (req, res) => {
  try {
    const { gigId, rating, comment } = req.body;
    const userId = req.user._id;

    const completedOrder = await Order.findOne({
      buyerId: userId,
      gigId,
      status: "completed"
    });

    if (!completedOrder) {
      return res.status(403).json({ message: "Only clients with completed orders can review." });
    }

    const alreadyReviewed = await Review.findOne({ gigId, userId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this gig." });
    }

    const review = new Review({ gigId, rating, comment, userId });
    const saved = await review.save();

    const allReviews = await Review.find({ gigId });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await Job.findByIdAndUpdate(gigId, {
      $set: { averageRating: avgRating.toFixed(1) }
    });

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to post review", error });
  }
};

export const getReviewsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const reviews = await Review.find({ gigId }).populate("userId", "username");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};
