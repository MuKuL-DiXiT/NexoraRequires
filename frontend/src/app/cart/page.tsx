"use client";
import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useUserStore } from '../../stores/userStore';
import Link from 'next/link';

export default function CartPage() {
  const {
    cart,
    isLoading,
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useCartStore();
  
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      alert('Failed to update item quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      alert('Failed to remove item from cart');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        alert('Failed to clear cart');
      }
    }
  };

  // Local UI state for checkout and toast
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string, ms = 4000) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), ms);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      setCheckoutLoading(true);

      // simulate processing delay
      await new Promise((res) => setTimeout(res, 900));

      // Build a simple receipt text
      const lines: string[] = [];
      lines.push('Receipt - AstrapeRequires');
      lines.push('Date: ' + new Date().toLocaleString());
      lines.push('');
      cartItems.forEach((ci: any, idx: number) => {
        const name = ci.item?.name || 'Item';
        const qty = ci.quantity || 1;
        const price = Number(ci.item?.price || 0);
        lines.push(`${idx + 1}. ${name} — ${qty} x $${price} = $${(qty * price).toFixed(2)}`);
      });
      lines.push('');
      lines.push(`Total: $${total}`);

      const receiptText = lines.join('\n');

      // Show toast to user about download
      showToast('Preparing receipt PDF for download...');

      // Create a blob and trigger download (simulate PDF by naming .pdf)
      const blob = new Blob([receiptText], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Clear the cart after download
      await clearCart();

      showToast('Receipt downloaded — your cart was cleared.');
    } catch (err) {
      console.error(err);
      showToast('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-light text-black mb-4 tracking-tight">Please Login</h1>
          <p className="text-gray-600 font-light mb-8">You need to be logged in to view your cart.</p>
          <Link
            href="/Auth"
            className="inline-block px-8 py-3 bg-black text-white font-medium text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && !cart) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading cart...</p>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const total = getCartTotal();
  const itemsCount = getCartItemsCount();

  return (
    <div className="min-h-screen bg-white">
      {toastMessage && (
        <div className="fixed right-4 bottom-6 z-50">
          <div className="bg-black text-white px-4 py-2 rounded shadow">{toastMessage}</div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-medium text-black tracking-tight">AstrapeRequires</span>
            </Link>
            <Link
              href="/items"
              className="text-gray-600 hover:text-black transition-colors text-sm font-medium tracking-wide uppercase"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light text-black tracking-tight">Shopping Cart</h1>
          <p className="text-gray-600 font-light mt-2">{itemsCount} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-light text-black mb-4 tracking-tight">Your cart is empty</h2>
            <p className="text-gray-600 font-light mb-8">Start shopping to add items to your cart!</p>
            <Link
              href="/items"
              className="inline-block px-8 py-3 bg-black text-white font-medium text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-black tracking-tight">Items</h2>
                <button
                  onClick={handleClearCart}
                  className="text-gray-600 hover:text-black transition-colors text-sm font-medium uppercase tracking-wider"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-6">
                {cartItems.map((cartItem) => (
                  <div key={cartItem._id} className="bg-white border border-gray-200 p-6">
                    <div className="flex items-start space-x-6">
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">No Image</span>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-black tracking-tight mb-1">{cartItem.item.name}</h3>
                        <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">{cartItem.item.category}</p>
                        {cartItem.item.description && (
                          <p className="text-gray-600 font-light text-sm">{cartItem.item.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)}
                              disabled={cartItem.quantity <= 1 || isLoading}
                              className="w-8 h-8 border border-gray-300 text-black hover:border-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-black font-medium">{cartItem.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)}
                              disabled={isLoading}
                              className="w-8 h-8 border border-gray-300 hover:border-black text-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm transition-colors"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-medium text-black">
                              ${cartItem.item.price * cartItem.quantity}
                            </p>
                            <p className="text-sm text-gray-600">${cartItem.item.price} each</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(cartItem.item._id)}
                          disabled={isLoading}
                          className="text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium uppercase tracking-wider mt-4 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 p-8 sticky top-8">
                <h2 className="text-lg font-medium text-black tracking-tight mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({itemsCount})</span>
                    <span className="text-black font-medium">${total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-black font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-black">Total</span>
                      <span className="text-lg font-medium text-black">${total}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || checkoutLoading}
                  className="w-full mt-8 px-6 py-3 bg-black text-white font-medium text-sm uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></span>
                      Processing...
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                
                <Link
                  href="/items"
                  className="block w-full mt-4 px-6 py-3 border border-gray-300 text-gray-600 font-medium text-sm uppercase tracking-wider hover:border-black hover:text-black transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
