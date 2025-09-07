"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useUserStore } from '../stores/userStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn } = useUserStore();

  return (
    <>
      <nav className="flex justify-between items-center px-4 sm:px-8 py-6 bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-medium text-black tracking-tight">AstrapeRequires</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/items" className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase">Shop</Link>
          <Link href="/items?category=electronics" className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase">Electronics</Link>
          <Link href="/items?category=clothing" className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase">Fashion</Link>
          <Link href="/items?category=books" className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase">Books</Link>
        </div>
        
        {/* Desktop Auth & Cart */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/cart" className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase">
                Cart
              </Link>
              <Link href="/dashboard" className="bg-black text-white px-6 py-2 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors">
                Account
              </Link>
            </>
          ) : (
            <Link href="/Auth" className="bg-black text-white px-6 py-2 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col space-y-1 p-2"
        >
          <span className={`block w-5 h-0.5 bg-black transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-black transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-black transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-b border-gray-100 transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 py-6 space-y-4">
          <Link href="/items" className="block text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase" onClick={() => setIsOpen(false)}>
            Shop
          </Link>
          <Link href="/items?category=electronics" className="block text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase" onClick={() => setIsOpen(false)}>
            Electronics
          </Link>
          <Link href="/items?category=clothing" className="block text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase" onClick={() => setIsOpen(false)}>
            Fashion
          </Link>
          <Link href="/items?category=books" className="block text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase" onClick={() => setIsOpen(false)}>
            Books
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/cart" className="block text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase" onClick={() => setIsOpen(false)}>
                Cart
              </Link>
              <Link href="/dashboard" className="block bg-black text-white px-6 py-2 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors w-fit" onClick={() => setIsOpen(false)}>
                Account
              </Link>
            </>
          ) : (
            <Link href="/Auth" className="block bg-black text-white px-6 py-2 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors w-fit" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col space-y-1 p-2"
        >
          <span className="w-6 h-0.5 bg-slate-900 transition-all"></span>
          <span className="w-6 h-0.5 bg-slate-900 transition-all"></span>
          <span className="w-6 h-0.5 bg-slate-900 transition-all"></span>
        </button>
      </nav>

      {/* Mobile Side Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900">Menu</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
              
              <nav className="space-y-6">
                <Link 
                  href="/home" 
                  className="block text-lg text-slate-700 hover:text-indigo-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  🛍️ Shop
                </Link>
                
                {isLoggedIn ? (
                  <Link 
                    href="/dashboard" 
                    className="block text-lg text-slate-700 hover:text-indigo-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/Auth" 
                    className="block text-lg text-slate-700 hover:text-indigo-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    🔐 Login / Sign Up
                  </Link>
                )}
                
                <Link 
                  href="#about" 
                  className="block text-lg text-slate-700 hover:text-indigo-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  ℹ️ About
                </Link>
                
                <Link 
                  href="#contact" 
                  className="block text-lg text-slate-700 hover:text-indigo-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  📧 Contact
                </Link>
              </nav>

              {/* Mobile CTA */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                {isLoggedIn ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                      Go to Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link href="/Auth" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
                      Get Started
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
