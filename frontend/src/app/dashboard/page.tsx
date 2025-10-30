"use client";
import { useState, useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useCartStore } from '../../stores/cartStore';
import Link from 'next/link';

export default function Dashboard() {
  const { user, clearUser } = useUserStore();
  const { getCartItemsCount } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/Auth';
      return;
    }
    
    // If user data is not in store, fetch from server
    if (!user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      useUserStore.getState().setUser(data.user);
    } catch (err) {
      console.error(err);
      // If fetch fails, redirect to auth
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/Auth';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearUser();
    window.location.href = '/';
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  const cartItemsCount = getCartItemsCount();
  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-medium text-black tracking-tight hidden md:inline">AstrapeRequires</span>
              <span className="text-xl font-medium text-black tracking-tight md:hidden">AR</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/items" className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase">
                Shop
              </Link>
              {!isAdmin && (
                <Link href="/cart" className="relative text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-black mb-2 tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600 font-light">
            {isAdmin ? 'Admin Dashboard' : 'Your Dashboard'}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            {/* Profile Picture */}
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-2xl font-light">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                <h2 className="text-xl font-medium text-black tracking-tight">{user.name}</h2>
                {isAdmin && (
                  <span className="inline-flex items-center px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <p>{user.email}</p>
                <p className="capitalize">{user.role}</p>
                <p>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="text-2xl font-light text-black mb-1">
              {isAdmin ? '∞' : cartItemsCount}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              {isAdmin ? 'Products' : 'Cart Items'}
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="text-2xl font-light text-black mb-1">0</div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              {isAdmin ? 'Categories' : 'Orders'}
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="text-2xl font-light text-black mb-1">0</div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              {isAdmin ? 'Users' : 'Wishlist'}
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="text-2xl font-light text-black mb-1">
              {user.role === 'admin' ? '∞' : '5'}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              {isAdmin ? 'Access' : 'Reviews'}
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link 
            href="/items"
            className="group bg-white border border-gray-200 p-8 hover:border-black transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2 tracking-tight">
                {isAdmin ? 'Manage Products' : 'Browse Items'}
              </h3>
              <p className="text-gray-600 font-light text-sm">
                {isAdmin ? 'Create & update products' : 'Explore our collection'}
              </p>
            </div>
          </Link>

          {!isAdmin && (
            <Link 
              href="/cart"
              className="group bg-white border border-gray-200 p-8 hover:border-black transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 7M7 13v7a2 2 0 002 2h6a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2 tracking-tight">View Cart</h3>
                <p className="text-gray-600 font-light text-sm">{cartItemsCount} items</p>
              </div>
            </Link>
          )}

          {isAdmin && (
            <Link 
              href="/admin"
              className="group bg-white border border-gray-200 p-8 hover:border-black transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2 tracking-tight">Admin Panel</h3>
                <p className="text-gray-600 font-light text-sm">Manage items & users</p>
              </div>
            </Link>
          )}

          <Link 
            href="/home"
            className="group bg-white border border-gray-200 p-8 hover:border-black transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-black mb-2 tracking-tight">Home</h3>
              <p className="text-gray-600 font-light text-sm">Return to homepage</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 p-8">
          <h3 className="text-lg font-medium text-black mb-6 tracking-tight">
            {isAdmin ? 'Admin Information' : 'Recent Activity'}
          </h3>
          <div className="space-y-4">
            {isAdmin ? (
              <>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Full system access granted</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Product management enabled</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">User management available</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Account created</span>
                  <span className="text-gray-400 ml-auto">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-600">Last login</span>
                  <span className="text-gray-400 ml-auto">Today</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
