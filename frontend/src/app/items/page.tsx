"use client";
import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useUserStore } from '../../stores/userStore';

interface Item {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });
  
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { user } = useUserStore();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
        setFilteredItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category._id === selectedCategory));
    }
  }, [selectedCategory, items]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = async (itemId: string) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart(itemId, 1);
      alert('Item added to cart!');
    } catch {
      alert('Failed to add item to cart');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setShowCreateForm(false);
        fetchItems();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create item');
      }
    } catch {
      alert('Error creating item');
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${editingItem._id}`, {
        method: 'PUT',
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
        alert('Item updated successfully!');
        setEditingItem(null);
        setFormData({ name: '', price: '', description: '', category: '' });
        fetchItems();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update item');
      }
    } catch {
      alert('Error updating item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
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
      } catch {
        alert('Error deleting item');
      }
    }
  };

  const startEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description || '',
      category: item.category._id,
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowCreateForm(false);
    setFormData({ name: '', price: '', description: '', category: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-black tracking-tight">
            {user?.role === 'admin' ? 'Manage Products' : 'Shop Collection'}
          </h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-black text-white px-6 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Add Product'}
            </button>
          )}
        </div>

        {/* Create/Edit Form for Admin */}
        {user?.role === 'admin' && (showCreateForm || editingItem) && (
          <div className="bg-gray-50 border border-gray-200 p-8 mb-12">
            <h2 className="text-xl font-medium mb-6 text-black tracking-tight">
              {editingItem ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors md:col-span-2"
                rows={3}
              />
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-800 transition-colors"
                >
                  {editingItem ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-black text-black px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-black hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Category Filter */}
        <div className="bg-gray-50 border border-gray-200 p-8 mb-12">
          <h2 className="text-lg font-medium mb-6 text-black tracking-tight">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              key="all"
              onClick={() => handleCategoryFilter('all')}
              className={`px-6 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-black text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryFilter(category._id)}
                className={`px-6 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${
                  selectedCategory === category._id
                    ? 'bg-black text-white'
                    : 'border border-gray-300 text-gray-600 hover:border-black hover:text-black'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div key={item._id} className="group">
                <div className="bg-gray-100 aspect-square mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm font-light">No Image</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-black group-hover:text-gray-600 transition-colors">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm font-light line-clamp-2">{item.description}</p>
                  )}
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{item.category.name}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-medium text-black">${item.price}</span>
                  </div>
                  
                  {/* Admin Controls */}
                  {user?.role === 'admin' ? (
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="flex-1 py-2 text-xs font-medium tracking-wide uppercase border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="flex-1 py-2 text-xs font-medium tracking-wide uppercase bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    /* User Add to Cart */
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      disabled={cartLoading || !user}
                      className="w-full py-3 bg-black text-white text-sm font-medium tracking-wide uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
                    >
                      {cartLoading ? 'Adding...' : 'Add to Cart'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-light">
              {selectedCategory === 'all' ? 'No items found.' : `No items found in this category.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
