"use client";
import React, { useEffect, useState } from 'react';
import { useHydratedUserStore } from '../../stores/userStore';
import { useCartStore } from '../../stores/cartStore';
import Link from 'next/link';
import { ShoppingBag, User, Settings, Filter, Grid3X3, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user, setUser, isLoggedIn, isHydrated } = useHydratedUserStore();
  const { getCartItemsCount, fetchCart } = useCartStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (user) {
      fetchCart();
    }
    
    if (!user) {
      const handleUserLoad = async () => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
              credentials: 'include',
            });
            
            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
        setLoading(false);
      };

      handleUserLoad();
    } else {
      setLoading(false);
    }
  }, [user, setUser, isHydrated, fetchCart]);

  const cartItemsCount = getCartItemsCount();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border border-gray-300 border-t-black mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 tracking-wide">LOADING</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* User Navigation Bar */}
      {user && (
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-black tracking-wide">
                  WELCOME, <span className="font-medium">{user.name.toUpperCase()}</span>
                </p>
                {user.role === 'admin' && (
                  <span className="px-2 py-1 text-xs bg-black text-white tracking-wider">ADMIN</span>
                )}
              </div>
              
              <div className="flex items-center space-x-8">
                <Link href="/cart" className="relative group">
                  <div className="flex items-center space-x-2 text-sm tracking-wide text-black hover:text-gray-600 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="font-medium">CART</span>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                </Link>
                
                <Link href="/dashboard" className="group">
                  <div className="flex items-center space-x-2 text-sm tracking-wide text-black hover:text-gray-600 transition-colors">
                    <User className="w-4 h-4" />
                    <span className="font-medium">ACCOUNT</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-black mb-6">
            a s t r a p e
            <br />
            R E Q U I R E S
          </h1>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 tracking-wide leading-relaxed mb-16">
            Discover a curated collection of premium products designed to elevate your lifestyle. From fashion to electronics, we have everything you need to express your unique style.
            <br />
            EVERYTHING YOU NEED IN ONE PLACE
          </p>
        </div>

        {/* Navigation Options */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Shop All Items */}
            <Link href="/items" className="group">
              <div className="border border-gray-300 hover:border-black transition-colors p-12 text-center min-h-[300px] flex flex-col justify-center">
                <div className="mb-6">
                  <Grid3X3 className="w-12 h-12 mx-auto text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-light tracking-wide text-black mb-3">SHOP ALL</h3>
                <p className="text-sm text-gray-600 tracking-wide mb-6">
                  BROWSE OUR COMPLETE COLLECTION OF PREMIUM PRODUCTS
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>EXPLORE</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Filter & Search */}
            <Link href="/items?filter=true" className="group">
              <div className="border border-gray-300 hover:border-black transition-colors p-12 text-center min-h-[300px] flex flex-col justify-center">
                <div className="mb-6">
                  <Filter className="w-12 h-12 mx-auto text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-light tracking-wide text-black mb-3">FILTER & FIND</h3>
                <p className="text-sm text-gray-600 tracking-wide mb-6">
                  SEARCH BY CATEGORY, PRICE RANGE, OR SPECIFIC CRITERIA
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>SEARCH</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Dashboard */}
            {user && (
              <Link href="/dashboard" className="group">
                <div className="border border-gray-300 hover:border-black transition-colors p-12 text-center min-h-[300px] flex flex-col justify-center">
                  <div className="mb-6">
                    <Settings className="w-12 h-12 mx-auto text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-xl font-light tracking-wide text-black mb-3">DASHBOARD</h3>
                  <p className="text-sm text-gray-600 tracking-wide mb-6">
                    MANAGE YOUR ACCOUNT, ORDERS, AND PREFERENCES
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm tracking-wider group-hover:translate-x-1 transition-transform">
                    <span>MANAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )}

            {/* Authentication for non-users */}
            {!user && (
              <>
                <Link href="/Auth" className="group">
                  <div className="border border-gray-300 hover:border-black transition-colors p-12 text-center min-h-[300px] flex flex-col justify-center">
                    <div className="mb-6">
                      <User className="w-12 h-12 mx-auto text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    <h3 className="text-xl font-light tracking-wide text-black mb-3">SIGN IN</h3>
                    <p className="text-sm text-gray-600 tracking-wide mb-6">
                      ACCESS YOUR ACCOUNT TO UNLOCK FULL FEATURES
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm tracking-wider group-hover:translate-x-1 transition-transform">
                      <span>LOGIN</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>

                <Link href="/cart" className="group">
                  <div className="border border-gray-300 hover:border-black transition-colors p-12 text-center min-h-[300px] flex flex-col justify-center">
                    <div className="mb-6">
                      <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    <h3 className="text-xl font-light tracking-wide text-black mb-3">CART</h3>
                    <p className="text-sm text-gray-600 tracking-wide mb-6">
                      VIEW AND MANAGE YOUR SELECTED ITEMS
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm tracking-wider group-hover:translate-x-1 transition-transform">
                      <span>VIEW</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats for logged in users */}
        {user && (
          <div className="py-16 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-light tracking-tight text-black mb-2">
                  {cartItemsCount}
                </div>
                <p className="text-sm text-gray-600 tracking-wide">ITEMS IN CART</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-light tracking-tight text-black mb-2">
                  {user.role.toUpperCase()}
                </div>
                <p className="text-sm text-gray-600 tracking-wide">ACCOUNT TYPE</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-light tracking-tight text-black mb-2">
                  ACTIVE
                </div>
                <p className="text-sm text-gray-600 tracking-wide">STATUS</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}