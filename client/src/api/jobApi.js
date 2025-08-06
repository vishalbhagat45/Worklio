// src/api/jobApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";
const CATEGORY_URL = "http://localhost:5000/api/categories";
const ORDER_URL = "http://localhost:5000/api/orders";
const REVIEW_URL = "http://localhost:5000/api/reviews";

// Get all jobs
export const fetchJobs = () => axios.get(API_URL);

// Get single job by ID
export const fetchJobById = (id) => axios.get(`${API_URL}/${id}`);

// Create a job
export const createJob = (jobData) => axios.post(API_URL, jobData);

// Update a job
export const updateJob = (id, jobData) => axios.put(`${API_URL}/${id}`, jobData);

// ❗Renamed as requested: Delete a job by ID
export const DeleteJobById = (id) => axios.delete(`${API_URL}/${id}`);

// Apply to a job
export const applyToJob = (id, applicantData) =>
  axios.post(`${API_URL}/${id}/apply`, applicantData);

// Get job categories
export const getCategories = () => axios.get(CATEGORY_URL);

// ✅ NEW: Fetch orders for a user (or all if admin)
export const fetchOrders = () => axios.get(ORDER_URL);

// ✅ NEW: Fetch reviews by a user
export const fetchReviewsByUser = (userId) =>
  axios.get(`${REVIEW_URL}/user/${userId}`);
