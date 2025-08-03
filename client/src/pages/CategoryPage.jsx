import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJobs } from "../api/jobApi";

export default function CategoryPage() {
  const { category } = useParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [budgetRange, setBudgetRange] = useState({ min: "", max: "" });
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      const res = await fetchJobs();
      const filtered = res.data.filter(
        (job) => job.category.toLowerCase() === category.toLowerCase()
      );
      setJobs(filtered);
      setFilteredJobs(filtered);
    };
    loadJobs();
  }, [category]);

  useEffect(() => {
    let updatedJobs = [...jobs];

    // Search filter
    if (searchTerm) {
      updatedJobs = updatedJobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Budget filter
    const min = parseFloat(budgetRange.min) || 0;
    const max = parseFloat(budgetRange.max) || Infinity;
    updatedJobs = updatedJobs.filter(
      (job) => job.budget >= min && job.budget <= max
    );

    // Delivery time filter
    if (deliveryTime) {
      const now = new Date();
      const maxDate = new Date();
      maxDate.setDate(now.getDate() + parseInt(deliveryTime));
      updatedJobs = updatedJobs.filter(
        (job) => new Date(job.deadline) <= maxDate
      );
    }

    setFilteredJobs(updatedJobs);
  }, [searchTerm, budgetRange, deliveryTime, jobs]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{category} Jobs</h2>

      {/* 🔍 Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="🔍 Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Budget"
            value={budgetRange.min}
            onChange={(e) =>
              setBudgetRange({ ...budgetRange, min: e.target.value })
            }
            className="input"
          />
          <input
            type="number"
            placeholder="Max Budget"
            value={budgetRange.max}
            onChange={(e) =>
              setBudgetRange({ ...budgetRange, max: e.target.value })
            }
            className="input"
          />
        </div>
        <select
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          className="input"
        >
          <option value="">⏳ Delivery Time</option>
          <option value="1">Within 1 Day</option>
          <option value="3">Within 3 Days</option>
          <option value="7">Within 7 Days</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500">No matching jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <li key={job._id} className="p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <p className="text-sm text-gray-600 mb-1">
                📂 {job.category} | 💰 ${job.budget}
              </p>
              {job.freelancer && (
                <p className="text-sm text-green-600">
                  👤 Freelancer: {job.freelancer.name}{" "}
                  {job.freelancer.rating && (
                    <>⭐ {job.freelancer.rating.toFixed(1)}/5</>
                  )}
                </p>
              )}
              <p className="text-xs text-gray-400">
                ⏱ Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
