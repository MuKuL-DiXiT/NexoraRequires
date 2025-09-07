import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 py-24 text-center max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-orange-50 -z-10"></div>
        <div className="mb-6">
          <span className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide uppercase">
            New Collection
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-light text-black mb-8 leading-tight tracking-tight">
          Discover Your
          <span className="font-normal italic"> Perfect Style </span>
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Curated collections of premium products designed for the modern lifestyle. Experience luxury, comfort, and style in every purchase.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link href="/items">
            <button className="bg-black text-white px-10 py-4 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
              Shop Collection
            </button>
          </Link>
          <Link href="/Auth">
            <button className="border border-black text-black px-10 py-4 text-sm font-medium tracking-wide uppercase hover:bg-black hover:text-white transition-all duration-300">
              Join Us
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-8 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-20 text-black tracking-tight">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:border-black transition-colors duration-300">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-medium mb-6 text-black">Premium Quality</h3>
              <p className="text-gray-600 font-light leading-relaxed">Carefully curated products that meet the highest standards of quality and craftsmanship.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:border-black transition-colors duration-300">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-medium mb-6 text-black">Fast Delivery</h3>
              <p className="text-gray-600 font-light leading-relaxed">Quick and reliable shipping to get your orders delivered right to your doorstep.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:border-black transition-colors duration-300">
                <span className="text-2xl">�</span>
              </div>
              <h3 className="text-xl font-medium mb-6 text-black">Exclusive Collections</h3>
              <p className="text-gray-600 font-light leading-relaxed">Unique and limited edition items you won&apos;t find anywhere else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-8 py-24 bg-black">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-light mb-8 tracking-tight">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-lg mb-12 opacity-80 font-light max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their lifestyle needs.
          </p>
          <Link href="/items">
            <button className="bg-white text-black px-10 py-4 text-sm font-medium tracking-wide uppercase hover:bg-gray-100 transition-all duration-300">
              Start Shopping
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-medium text-black">AstrapeRequires</span>
              </div>
              <p className="text-gray-600 font-light leading-relaxed">Curating exceptional products for the modern lifestyle.</p>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-black tracking-wide">Shop</h4>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><Link href="/items" className="hover:text-black transition-colors">All Products</Link></li>
                <li><Link href="/items?category=electronics" className="hover:text-black transition-colors">Electronics</Link></li>
                <li><Link href="/items?category=clothing" className="hover:text-black transition-colors">Fashion</Link></li>
                <li><Link href="/items?category=books" className="hover:text-black transition-colors">Books</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-black tracking-wide">Account</h4>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><Link href="/Auth" className="hover:text-black transition-colors">Sign In</Link></li>
                <li><Link href="/dashboard" className="hover:text-black transition-colors">My Account</Link></li>
                <li><Link href="/cart" className="hover:text-black transition-colors">Shopping Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-6 text-black tracking-wide">Support</h4>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-light text-sm">&copy; 2025 AstrapeRequires. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
