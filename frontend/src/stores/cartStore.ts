import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  item: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    category: string;
  };
  quantity: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  setCart: (cart: Cart) => void;
  addToCart: (itemId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`http://localhost:3001${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API call failed');
  }

  return response.json();
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      setCart: (cart: Cart) => set({ cart }),

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const data = await apiCall('/cart');
          set({ cart: data.cart });
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (itemId: string, quantity = 1) => {
        try {
          set({ isLoading: true });
          const data = await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ itemId, quantity }),
          });
          set({ cart: data.cart });
        } catch (error) {
          console.error('Error adding to cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        try {
          set({ isLoading: true });
          const data = await apiCall('/cart/update', {
            method: 'PUT',
            body: JSON.stringify({ itemId, quantity }),
          });
          set({ cart: data.cart });
        } catch (error) {
          console.error('Error updating cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (itemId: string) => {
        try {
          set({ isLoading: true });
          const data = await apiCall(`/cart/remove/${itemId}`, {
            method: 'DELETE',
          });
          set({ cart: data.cart });
        } catch (error) {
          console.error('Error removing from cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true });
          const data = await apiCall('/cart/clear', {
            method: 'DELETE',
          });
          set({ cart: data.cart });
        } catch (error) {
          console.error('Error clearing cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getCartTotal: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.items.reduce((total, item) => {
          return total + (item.item.price * item.quantity);
        }, 0);
      },

      getCartItemsCount: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: {
        getItem: (name) => {
          if (typeof window !== 'undefined') {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);
