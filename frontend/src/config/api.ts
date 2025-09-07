export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_CONFIG.BASE_URL}/login`,
    SIGNUP: `${API_CONFIG.BASE_URL}/signup`,
    GOOGLE: `${API_CONFIG.BASE_URL}/login/google`,
    USER: `${API_CONFIG.BASE_URL}/user`,
  },
  ITEMS: {
    BASE: `${API_CONFIG.BASE_URL}/items`,
    BY_ID: (id: string) => `${API_CONFIG.BASE_URL}/items/${id}`,
  },
  CATEGORIES: {
    BASE: `${API_CONFIG.BASE_URL}/categories`,
  },
  CART: {
    BASE: `${API_CONFIG.BASE_URL}/cart`,
    ADD: `${API_CONFIG.BASE_URL}/cart/add`,
    UPDATE: `${API_CONFIG.BASE_URL}/cart/update`,
    REMOVE: `${API_CONFIG.BASE_URL}/cart/remove`,
  },
};
