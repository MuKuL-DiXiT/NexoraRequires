"use client";

import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light text-black tracking-tight mb-4">Welcome Back</h1>
          <p className="text-gray-600 font-light">Sign in to your account or create a new one</p>
        </div>
        
        <div className="flex mb-8 border border-gray-200">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-medium tracking-wide uppercase transition-colors ${
              mode === 'login' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-600 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-sm font-medium tracking-wide uppercase transition-colors ${
              mode === 'signup' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-600 hover:text-black'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <div className="w-full">
          {mode === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}
