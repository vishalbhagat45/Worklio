import React, { useState, useEffect } from 'react';
import { createJob, getCategories } from '../api/jobApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    category: '',
    budget: '',
    description: '',
    deadline: '',
  });

  const [categories, setCategories] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories(); // assumed endpoint
        setCategories(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories');
      }
    }

    fetchCategories();
  }, []);

  // Escape key listener to reset form (simulate modal close)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setForm({
        title: '',
        category: '',
        budget: '',
        description: '',
        deadline: ''
      });
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Handle theme toggle
  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((v) => !v)) {
      toast.warning('Please fill in all the fields!');
      return;
    }

    try {
      await createJob(form);
      toast.success('🎉 Job posted successfully!');
      setForm({ title: '', category: '', budget: '', description: '', deadline: '' });
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to post job');
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100'} min-h-screen py-10`}>
      <ToastContainer />
      <div className="flex justify-between items-center px-6 max-w-5xl mx-auto mb-4">
        <button
          onClick={() => window.location.href = '/'}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          ← Back to Home
        </button>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto`}>
        <h1 className="text-3xl font-bold mb-6 text-center">
          🚀 Post a New Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="budget"
            placeholder="Budget in USD"
            value={form.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            📤 Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
