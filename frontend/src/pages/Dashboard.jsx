import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [myPosts, setMyPosts] = useState([]);
  const [myHousings, setMyHousings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadMyContent();
  }, []);

  const loadMyContent = async () => {
    try {
      const [postsRes, housingsRes] = await Promise.all([
        api.get('/buysell'),
        api.get('/housing')
      ]);

      setMyPosts(postsRes.data.filter(p => p.user._id === user._id));
      setMyHousings(housingsRes.data.filter(h => h.user._id === user._id));
    } catch (err) {
      console.error('Failed to load content:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/auth/profile', formData);
      setUser(res.data);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setChangingPassword(false);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await api.post('/auth/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id, type) => {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
      await api.delete(`/${type}/${id}`);
      if (type === 'buysell') {
        setMyPosts(myPosts.filter(p => p._id !== id));
      } else {
        setMyHousings(myHousings.filter(h => h._id !== id));
      }
      setMessage({ type: 'success', text: 'Deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="profile-pic-upload"
                    className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg"
                    title="Change profile picture"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {user?.department}
                </span>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <button
                onClick={() => setChangingPassword(!changingPassword)}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Change Password
              </button>

              {changingPassword && (
                <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">My Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Buy/Sell Posts</span>
                  <span className="font-bold text-blue-600">{myPosts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Housing Posts</span>
                  <span className="font-bold text-blue-600">{myHousings.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Buy/Sell Posts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">My Buy & Sell Posts</h3>
                <Link to="/buysell/create" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                  + New Post
                </Link>
              </div>
              {myPosts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No posts yet</p>
              ) : (
                <div className="space-y-3">
                  {myPosts.map(post => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{post.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">৳{post.price} • {post.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/buysell/${post._id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id, 'buysell')}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Housing Posts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">My Housing Posts</h3>
                <Link to="/housing/create" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                  + New Listing
                </Link>
              </div>
              {myHousings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No housing posts yet</p>
              ) : (
                <div className="space-y-3">
                  {myHousings.map(housing => (
                    <div key={housing._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">৳{housing.rent}/month</h4>
                          <p className="text-sm text-gray-600 mt-1">{housing.address}</p>
                          <p className="text-xs text-gray-500 mt-1">{housing.roommatesNeeded} roommates needed</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeletePost(housing._id, 'housing')}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
