import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // or "Gig" if you're renaming
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent duplicate review per user per gig
reviewSchema.index({ gigId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
