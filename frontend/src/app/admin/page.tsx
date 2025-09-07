"use client";
import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';

interface Item {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
}

export default function AdminPage() {
  const { user } = useUserStore();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });

  const fetchItems = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchItems();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
        credentials: 'include',
      });

      if (response.ok) {
        alert('Item created successfully!');
        setFormData({ name: '', price: '', description: '', category: '' });
        fetchItems();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create item');
      }
    } catch (error) {
      alert('Error creating item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          alert('Item deleted successfully!');
          fetchItems();
        } else {
          alert('Failed to delete item');
        }
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to access admin panel.</p>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {/* Add Item Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
              <option value="toys">Toys</option>
            </select>
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
              rows={3}
            />
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </form>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Manage Items ({items.length})</h2>
          </div>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item._id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price} • {item.category}</p>
                  {item.description && (
                    <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No items created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
