import Job from "../models/Job.js";
import Order from "../models/Order.js";

export const createJob = async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, postedBy: req.user._id });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrdersByUserRole = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const query = role === "client" ? { buyerId: userId } : { sellerId: userId };
    const orders = await Order.find(query)
      .populate("jobId", "title")
      .populate("sellerId buyerId", "username");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { proposal } = req.body;
    const freelancerId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const alreadyApplied = job.applicants.find(
      (a) => a.freelancerId.toString() === freelancerId.toString()
    );
    if (alreadyApplied)
      return res.status(400).json({ message: "Already applied to this job" });

    job.applicants.push({ freelancerId, proposal });
    await job.save();
    res.status(200).json({ message: "Applied successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({ jobs, totalPages: Math.ceil(total / limit), currentPage: +page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ "applicants.freelancerId": req.user._id });
    const myApplications = jobs.map(job => {
      const myProposal = job.applicants.find(app => app.freelancerId.toString() === req.user._id.toString());
      return {
        jobId: job._id,
        title: job.title,
        proposal: myProposal.proposal,
        appliedAt: myProposal.appliedAt
      };
    });
    res.status(200).json(myApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicantsForGig = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants.freelancerId", "username email");
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applicants of this gig" });
    }

    res.status(200).json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find job that contains this application ID
    const job = await Job.findOne({ "applicants._id": applicationId });
    if (!job) return res.status(404).json({ message: "Application not found" });

    // Ensure the logged-in user is the owner of the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update the specific applicant status
    const applicant = job.applicants.id(applicationId);
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });

    applicant.status = status;
    await job.save();

    res.status(200).json({ message: "Application status updated", application: applicant });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};