import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/jobs', {
        params: {
          category: category || undefined,
          search: search || undefined,
          page,
          limit: 6,
        },
      });
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [category, search, page]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Find the Right Gig for You</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          className="p-2 border rounded w-full md:w-1/4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search gigs..."
          className="p-2 border rounded w-full md:w-2/4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Gigs */}
      {loading ? (
        <p className="text-center">Loading gigs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-600">No gigs found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-xl shadow hover:shadow-lg p-4 cursor-pointer transition bg-white"
                onClick={() => navigate(`/job/${job._id}`)}
              >
                <img
                  src={job.image || 'https://via.placeholder.com/400x240'}
                  alt={job.title}
                  className="h-40 w-full object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {job.description.slice(0, 80)}...
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={job.seller?.avatar || 'https://i.pravatar.cc/40'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{job.seller?.name || 'Freelancer'}</p>
                    <p className="text-xs text-gray-500">{job.category}</p>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <span className="text-blue-600 font-bold text-lg">₹{job.budget}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  i + 1 === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
