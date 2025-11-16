import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HousingCard from '../components/HousingCard.jsx';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PlusCircle, Search, Frown, Filter, X } from 'lucide-react';

const Housing = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState('all');
  const [housingTypeFilter, setHousingTypeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [maxRent, setMaxRent] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/housing');
      setPosts(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load housing posts:', err);
      setError('Failed to load listings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to permanently delete this listing?')) {
      try {
        await api.delete(`/housing/${id}`);
        // Optimistically update the UI
        setPosts(posts.filter(p => p._id !== id));
      } catch (err) {
        console.error('Failed to delete listing:', err);
        alert('Failed to delete listing. Please try again.');
        // Optionally reload posts here: loadPosts();
      }
    }
  };

  // Apply filters
  const displayPosts = posts
    .filter(post => post.user) // Filter out posts without valid user
    .filter(post => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          post.title?.toLowerCase().includes(search) ||
          post.location?.toLowerCase().includes(search) ||
          post.address?.toLowerCase().includes(search) ||
          post.description?.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .filter(post => {
      // Post type filter (available/wanted)
      if (postTypeFilter !== 'all') {
        return post.postType === postTypeFilter;
      }
      return true;
    })
    .filter(post => {
      // Housing type filter (flat/sublet/hostel/mess)
      if (housingTypeFilter !== 'all') {
        return post.housingType === housingTypeFilter;
      }
      return true;
    })
    .filter(post => {
      // Gender preference filter
      if (genderFilter !== 'all') {
        return post.genderPreference === genderFilter;
      }
      return true;
    })
    .filter(post => {
      // Max rent filter
      if (maxRent) {
        const rent = post.rent || 0;
        return rent <= parseInt(maxRent);
      }
      return true;
    });

  // --- UI Feedback States ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-gray-50 rounded-xl shadow-lg">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Searching for housing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-10 mt-10 text-center bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
        <p className="text-xl font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-0">
            🏡 Housing & Roommates
          </h1>
          {user ? (
            <Link
              to="/housing/create"
              className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-0.5 text-lg"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              New Listing
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 border border-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Log in to post a listing
            </Link>
          )}
        </header>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition ${showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Post Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Type
                </label>
                <select
                  value={postTypeFilter}
                  onChange={(e) => setPostTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="wanted">Wanted</option>
                </select>
              </div>

              {/* Housing Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Housing Type
                </label>
                <select
                  value={housingTypeFilter}
                  onChange={(e) => setHousingTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="flat">Flat</option>
                  <option value="sublet">Sublet</option>
                  <option value="hostel">Hostel</option>
                  <option value="mess">Mess</option>
                </select>
              </div>

              {/* Gender Preference Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Preference
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="any">Any</option>
                </select>
              </div>

              {/* Max Rent Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Rent (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(searchTerm || postTypeFilter !== 'all' || housingTypeFilter !== 'all' || genderFilter !== 'all' || maxRent) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-600">Active Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: {searchTerm}
                  <X
                    className="w-4 h-4 ml-2 cursor-pointer"
                    onClick={() => setSearchTerm('')}
                  />
                </span>
              )}
              {postTypeFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {postTypeFilter}
                  <X
                    className="w-4 h-4 ml-2 cursor-pointer"
                    onClick={() => setPostTypeFilter('all')}
                  />
                </span>
              )}
              {housingTypeFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {housingTypeFilter}
                  <X
                    className="w-4 h-4 ml-2 cursor-pointer"
                    onClick={() => setHousingTypeFilter('all')}
                  />
                </span>
              )}
              {genderFilter !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {genderFilter}
                  <X
                    className="w-4 h-4 ml-2 cursor-pointer"
                    onClick={() => setGenderFilter('all')}
                  />
                </span>
              )}
              {maxRent && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Max: ৳{maxRent}
                  <X
                    className="w-4 h-4 ml-2 cursor-pointer"
                    onClick={() => setMaxRent('')}
                  />
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPostTypeFilter('all');
                  setHousingTypeFilter('all');
                  setGenderFilter('all');
                  setMaxRent('');
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Current Post Count */}
        <div className="mb-6 text-lg font-medium text-gray-700">
          Found <span className="font-bold text-blue-600">{displayPosts.length}</span> {displayPosts.length === 1 ? 'listing' : 'listings'}.
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayPosts.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-md">
              <Frown className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700">No housing listings found.</p>
              <p className="text-gray-500 mt-2">Be the first to post a listing in this area!</p>
            </div>
          ) : (
            displayPosts.map(post => (
              <HousingCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Housing;