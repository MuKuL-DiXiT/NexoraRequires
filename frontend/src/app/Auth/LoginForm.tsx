
"use client";
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useUserStore } from '../../stores/userStore';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser, clearUser } = useUserStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    // Clear any existing tokens and user state before Google OAuth
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearUser();
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Clear any existing tokens before login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
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
        {loading ? 'Signing In...' : 'Sign In'}
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
        onClick={handleGoogleLogin}
        className="w-full border border-gray-300 text-gray-700 py-4 text-sm font-medium tracking-wide uppercase hover:border-black hover:text-black transition-colors flex items-center justify-center space-x-2"
      >
        <FaGoogle className="w-4 h-4" />
        <span>Google</span>
      </button>
    </form>
  );
}