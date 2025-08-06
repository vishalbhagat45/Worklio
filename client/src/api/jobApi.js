// src/api/jobApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";
const CATEGORY_URL = "http://localhost:5000/api/categories";
const ORDER_URL = "http://localhost:5000/api/orders";
const REVIEW_URL = "http://localhost:5000/api/reviews";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Jobs
export const fetchJobs = () => axios.get(API_URL);
export const fetchJobById = (id) => axios.get(`${API_URL}/${id}`);
export const createJob = (jobData) => axios.post(API_URL, jobData);
export const updateJob = (id, jobData) => axios.put(`${API_URL}/${id}`, jobData);
export const DeleteJobById = (id) => axios.delete(`${API_URL}/${id}`);
export const applyToJob = (id, applicantData) =>
  axios.post(`${API_URL}/${id}/apply`, applicantData);

// Categories
export const getCategories = () => axios.get(CATEGORY_URL);

// Orders
export const fetchOrders = () => axios.get(ORDER_URL, getAuthHeaders());

// Reviews
export const fetchReviewsByUser = (userId) =>
  axios.get(`${REVIEW_URL}/user/${userId}`, getAuthHeaders());
