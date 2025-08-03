import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReviewSection from "../components/ReviewSection";
import { toast } from "react-toastify";

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState("");

  // Fetch job details
  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
      setJob(res.data);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("❌ Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();

    const handleEsc = (e) => {
      if (e.key === "Escape") toast.dismiss();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [jobId]);

  // Submit a proposal
  const handleApply = async () => {
    if (!proposal.trim()) {
      toast.warn("📝 Please enter a proposal before applying.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {
          freelancerId: "dummyFreelancerId123", // TODO: Replace with actual user ID
          proposal,
        }
      );
      toast.success("✅ Successfully applied to this job!");
      setProposal("");
    } catch (error) {
      console.error("Apply failed:", error);
      toast.error("❌ Failed to apply. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!job) return <p className="text-center mt-10">Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl shadow-md transition duration-300 ease-in-out">
      <h2 className="text-3xl font-semibold mb-4">{job.title}</h2>
      <p className="mb-1">📁 Category: {job.category}</p>
      <p className="mb-1">💰 Budget: ₹{job.budget}</p>
      <p className="mb-1">⏳ Deadline: {job.deadline || "Not specified"}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        🕓 Posted on: {new Date(job.createdAt).toLocaleDateString()}
      </p>

      <p className="mb-6">{job.description}</p>

      <textarea
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        placeholder="Write your proposal message here..."
        rows={4}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-4 dark:bg-gray-800 dark:text-white"
      />

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          🚀 Apply Now
        </button>

        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline"
        >
          🔙 Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-green-600 hover:underline"
        >
          🏠 Back to Home
        </button>
      </div>

      {/* ✅ Review Section */}
      <div className="mt-10">
        <ReviewSection gigId={job._id} />
      </div>
    </div>
  );
}
