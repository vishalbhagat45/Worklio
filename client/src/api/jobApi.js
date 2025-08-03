// src/api/jobApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs"; // update if hosted
const CATEGORY_URL = "http://localhost:5000/api/categories"; // assuming this endpoint exists

// Get all jobs
export const fetchJobs = () => axios.get(API_URL);

// Get single job by ID
export const fetchJobById = (id) => axios.get(`${API_URL}/${id}`);

// Create a job
export const createJob = (jobData) => axios.post(API_URL, jobData);

// Update a job
export const updateJob = (id, jobData) => axios.put(`${API_URL}/${id}`, jobData);

// Delete a job
export const deleteJob = (id) => axios.delete(`${API_URL}/${id}`);

// Apply to a job
export const applyToJob = (id, applicantData) =>
  axios.post(`${API_URL}/${id}/apply`, applicantData);

// ✅ NEW: Get job categories
export const getCategories = () => axios.get(CATEGORY_URL);
