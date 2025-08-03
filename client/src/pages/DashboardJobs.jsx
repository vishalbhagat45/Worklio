import React, { useEffect, useState } from "react";
import { fetchJobs, deleteJob } from "../api/jobApi";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";

export default function DashboardJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const navigate = useNavigate();

  const loadJobs = async () => {
    try {
      const res = await fetchJobs();
      let fetchedJobs = Array.isArray(res.data) ? res.data : res.data.jobs || [];

      // Sort
      fetchedJobs.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });

      setJobs(fetchedJobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;
    await deleteJob(id);
    loadJobs();
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const statusBadge = (status) => {
    let color = "gray";
    if (status === "Open") color = "green";
    else if (status === "Closed") color = "red";
    else if (status === "Paused") color = "yellow";

    return (
      <span className={`text-xs px-2 py-1 rounded bg-${color}-100 text-${color}-700 font-semibold`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">🎯 Your Gigs</h2>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-48"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Paused">Paused</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {currentJobs.length === 0 ? (
        <p className="text-gray-600">No gigs found.</p>
      ) : (
        <ul className="space-y-4">
          {currentJobs.map((job) => (
            <li key={job._id} className="p-4 bg-white rounded shadow border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                {statusBadge(job.status || "Open")}
              </div>
              <p className="text-sm text-gray-700 mb-1 line-clamp-2">{job.description}</p>
              <p className="text-sm text-gray-500">
                {job.category} | ₹{job.budget} | Posted on {moment(job.createdAt).format("LL")}
              </p>
              <p className="text-sm mt-1 text-gray-600">
                Applicants: <strong>{job.applicants?.length || 0}</strong>
              </p>
              <div className="mt-3 flex gap-4">
                <button
                  onClick={() => navigate(`/edit/${job._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Link
        to="/"
        className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
