// src/components/EditGigModal.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditGigModal({ gig, onClose, onSave }) {
  const [form, setForm] = useState({
    title: gig.title,
    description: gig.description,
    budget: gig.budget,
  });

  const [isDark, setIsDark] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setIsDark(true);
  }, []);

  // Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.title.trim() || !form.description.trim() || !form.budget) {
      toast.error("All fields are required.");
      return false;
    }
    if (form.budget <= 0) {
      toast.error("Budget must be greater than 0.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`/api/gigs/${gig._id}`, form);
      toast.success("Gig updated successfully!");
      onSave();  // Refresh gigs list
      onClose(); // Close modal
    } catch (err) {
      toast.error("Error updating gig.");
      console.error("Error updating gig", err);
    }
  };

  const themeClass = isDark ? "bg-gray-900 text-white" : "bg-white text-black";
  const inputClass = isDark
    ? "bg-gray-800 text-white border-gray-600"
    : "bg-white text-black border-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded shadow w-full max-w-md ${themeClass}`}>
        <h3 className="text-xl font-bold mb-4">Edit Gig</h3>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={`w-full border p-2 mb-3 rounded ${inputClass}`}
          placeholder="Gig Title"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className={`w-full border p-2 mb-3 rounded ${inputClass}`}
          placeholder="Description"
        />
        <input
          type="number"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className={`w-full border p-2 mb-4 rounded ${inputClass}`}
          placeholder="Budget"
        />
        <div className="flex justify-end space-x-2">
          <button className="bg-gray-300 px-3 py-1 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
