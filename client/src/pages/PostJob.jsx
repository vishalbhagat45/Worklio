import React, { useEffect, useState } from "react";
import { getCategories } from "../api/jobApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "client") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.budget || !formData.category) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post("/api/jobs", {
        ...formData,
        clientId: user?._id,
      });
      if (res.status === 201) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error posting job:", err);
      setError("Failed to post job.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Post a Job</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Budget</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
