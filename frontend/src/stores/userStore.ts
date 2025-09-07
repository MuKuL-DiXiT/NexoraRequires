import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profile?: string;
  google_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user: User) => set({ user, isLoggedIn: true }),
      clearUser: () => set({ user: null, isLoggedIn: false }),
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'user-storage',
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

// Hook to handle hydration in Next.js
export const useHydratedUserStore = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useUserStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return { isHydrated, ...store };
};
