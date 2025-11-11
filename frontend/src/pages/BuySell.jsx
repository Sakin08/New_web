import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar from '../components/FilterBar.jsx';
import api from '../api/buysell.js';

const BuySell = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ sort: 'newest' });

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allPosts, searchQuery, filters]);

  const loadPosts = async () => {
    try {
      const res = await api.getAll();
      setAllPosts(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...allPosts];

    // Search filter
    if (searchQuery) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (filters.minPrice) {
      result = result.filter(post => post.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(post => post.price <= Number(filters.maxPrice));
    }

    // Location filter
    if (filters.location) {
      result = result.filter(post =>
        post.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredPosts(result);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="container mx-auto p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Buy & Sell</h1>
          <Link
            to="/buysell/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            + New Post
          </Link>
        </div>

        <div className="mb-6">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search for items..."
          />
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          type="buysell"
        />

        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredPosts.length} of {allPosts.length} posts
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">No posts found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            filteredPosts.map(post => <PostCard key={post._id} post={post} type="buysell" />)
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySell;