import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    budget: Number,
    description: String,
    deadline: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        proposal: String,
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);