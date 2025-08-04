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

    await updateAverageRating(gigId);

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

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    await updateAverageRating(review.gigId);

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to update review", error });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (
      review.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.deleteOne();
    await updateAverageRating(review.gigId);

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error });
  }
};

// Utility to update gig average rating
const updateAverageRating = async (gigId) => {
  const allReviews = await Review.find({ gigId });
  const avgRating =
    allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  await Job.findByIdAndUpdate(gigId, {
    averageRating: avgRating.toFixed(1),
  });
};
