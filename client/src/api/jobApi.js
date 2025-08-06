// src/api/jobApi.js
import axios from "axios";

// ✅ Use environment variable
const BASE_API = import.meta.env.VITE_API_URL;

const API_URL = `${BASE_API}/jobs`;
const CATEGORY_URL = `${BASE_API}/categories`;
const ORDER_URL = `${BASE_API}/orders`;
const REVIEW_URL = `${BASE_API}/reviews`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Jobs
export const fetchJobs = () => axios.get(API_URL);
export const fetchJobById = (id) => axios.get(`${API_URL}/${id}`);
export const createJob = (jobData) => axios.post(API_URL, jobData);
export const updateJob = (id, jobData) => axios.put(`${API_URL}/${id}`, jobData);
export const DeleteJobById = (id) => axios.delete(`${API_URL}/${id}`);
export const applyToJob = (id, applicantData) =>
  axios.post(`${API_URL}/${id}/apply`, applicantData);

// ✅ Categories
export const getCategories = () => axios.get(CATEGORY_URL);

// ✅ Orders
export const fetchOrders = () => axios.get(ORDER_URL, getAuthHeaders());

// ✅ Reviews
export const fetchReviewsByUser = (userId) =>
  axios.get(`${REVIEW_URL}/user/${userId}`, getAuthHeaders());
