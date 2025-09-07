"use client";
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useUserStore } from '../../stores/userStore';

type SignupFormState = {
  name: string;
  email: string;
  password: string;
  role: string;
  profile: File | null;
};

export default function SignupForm() {
  const [form, setForm] = useState<SignupFormState>({ name: '', email: '', password: '', role: 'user', profile: null });
  const [loading, setLoading] = useState(false);
  const { setUser, clearUser } = useUserStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profile' && files && files[0]) {
      setForm({ ...form, profile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleGoogleSignup = () => {
    // Clear any existing tokens and user state before Google OAuth
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearUser();
    window.location.href = 'http://localhost:3001/login/google';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Clear any existing tokens before signup
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('role', form.role);
    if (form.profile) {
      formData.append('profile', form.profile);
    }

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      const data = await response.json();
      // Store new tokens in localStorage
      localStorage.setItem('accessToken', data.token.accessToken);
      localStorage.setItem('refreshToken', data.token.refreshToken);
      // Store user in Zustand
      setUser(data.safeUser);
      // Redirect to home
      window.location.replace('/');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-4 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-4 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-4 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full border border-gray-300 text-gray-700 py-4 text-sm font-medium tracking-wide uppercase hover:border-black hover:text-black transition-colors flex items-center justify-center space-x-2"
      >
        <FaGoogle className="w-4 h-4" />
        <span>Google</span>
      </button>
    </form>
  );
}
