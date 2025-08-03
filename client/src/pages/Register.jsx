import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client', // Default role
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const users = JSON.parse(localStorage.getItem('allUsers')) || [];
    const existingUser = users.find((user) => user.email === formData.email);

    if (existingUser) {
      alert('Email is already registered');
      return;
    }

    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    localStorage.setItem('allUsers', JSON.stringify([...users, newUser]));
    alert('Registration successful!');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="flex w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="w-1/2 bg-blue-100 flex items-center justify-center p-6">
          <img
            src="/assets/sign.jpg"
            alt="illustration"
            className="w-full h-96 max-w-xs"
          />
        </div>

        <div className="w-1/2 p-10">
          <h2 className="text-4xl font-bold text-blue-600 mb-2">Join Worklio</h2>
          <p className="text-gray-600 mb-6">A workspace for Freelancers and Clients</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Your Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md"
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md"
              required
            >
              <option value="client">I’m a Client</option>
              <option value="freelancer">I’m a Freelancer</option>
            </select>

            <div className="flex justify-between gap-4 mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md"
              >
                Sign Up Now
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-md"
              >
                Go to Login
              </button>
            </div>
          </form>

          <div className="text-center my-6 text-gray-500">or you can join with</div>
          <div className="flex justify-center gap-4">
            <button className="p-3 bg-gray-200 rounded-full hover:bg-blue-100">
              <FaGoogle />
            </button>
            <button className="p-3 bg-gray-200 rounded-full hover:bg-blue-100">
              <FaFacebookF />
            </button>
            <button className="p-3 bg-gray-200 rounded-full hover:bg-blue-100">
              <FaTwitter />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
