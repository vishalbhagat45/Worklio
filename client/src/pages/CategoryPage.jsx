// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState('');

 useEffect(() => {
  const fetchCategory = async () => {
    try {
      const res = await axios.get(`/api/categories/${slug}`);
      setCategory(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching category:', err);
      setError('Category not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  if (slug) fetchCategory();
}, [slug]);

useEffect(() => {
  const fetchGigs = async () => {
    try {
      const res = await axios.get(`/api/gigs?category=${slug}`);
      const allGigs = res.data || [];

      // ✅ Filter: only gigs posted by freelancers
      const gigsByFreelancers = allGigs.filter(
        gig => gig.postedBy?.role === 'freelancer'
      );

      setGigs(gigsByFreelancers);
    } catch (err) {
      console.error('Error fetching gigs:', err);
    }
  };

  if (slug) fetchGigs();
}, [slug]);

useEffect(() => {
  let results = [...gigs];

  // ✅ Filter by price range
  if (priceRange.min || priceRange.max) {
    results = results.filter(gig => {
      const price = gig.price || 0;
      return (
        (!priceRange.min || price >= parseInt(priceRange.min)) &&
        (!priceRange.max || price <= parseInt(priceRange.max))
      );
    });
  }

  // ✅ Filter by search term
  if (search.trim()) {
    const term = search.toLowerCase();
    results = results.filter(gig =>
      gig.title.toLowerCase().includes(term) ||
      gig.description?.toLowerCase().includes(term)
    );
  }

  // ✅ Sort by price or newest
  if (sortBy === 'price') {
    results.sort((a, b) => a.price - b.price);
  } else {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  setFilteredGigs(results);
}, [search, priceRange, sortBy, gigs]);

// ✅ Show loading or error if needed
if (loading) return <div className="text-center py-20 text-lg">Loading category...</div>;
if (error) return <div className="text-center py-20 text-red-500">{error}</div>;


  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 px-6 pt-6 pb-12">
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg p-8 mb-10 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 capitalize">{category?.name}</h1>
        <p className="text-white/90 text-sm">{category?.description || 'Explore top services in this category.'}</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search gigs..."
          className="w-full md:w-1/3 p-2 border rounded-md dark:bg-cyan-900 dark:border-cyan-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min ₹"
            className="w-24 p-2 border rounded-md dark:bg-cyan-900 dark:border-cyan-700"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max ₹"
            className="w-24 p-2 border rounded-md dark:bg-cyan-900 dark:border-cyan-700"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
        <select
          className="p-2 border rounded-md dark:bg-cyan-900 dark:border-cyan-700"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {/* Gigs Grid */}
      {filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGigs.map((gig) => (
            <div
              key={gig._id}
              className="border rounded-lg p-4 hover:shadow-lg transition bg-white dark:bg-gray-900 dark:border-gray-700"
            >
              <img
                src={gig.image || 'https://via.placeholder.com/300x200'}
                alt={gig.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-1">{gig.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {gig.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{gig.price}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(gig.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-12">No gigs found.</div>
      )}
    </div>
  );
}
