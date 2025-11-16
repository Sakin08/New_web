import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/buysell.js';
import MessageButton from '../components/MessageButton.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import PosterInfo from '../components/PosterInfo.jsx';
import DeleteButton from '../components/DeleteButton.jsx';

const BuySellDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const res = await api.getOne(id);
      setPost(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load post:', err);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.remove(id);
      alert('Post deleted successfully!');
      navigate('/buysell');
    } catch (err) {
      console.error('Failed to delete post:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete post';
      alert(`Error: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) return <div className="container mx-auto p-6">Post not found</div>;

  // Check if post.user exists (user might have been deleted)
  if (!post.user) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">This post's owner account no longer exists.</p>
          <Link to="/buysell" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const images = post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : []);
  const isOwnPost = currentUser && post.user && currentUser._id === post.user._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/buysell" className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-block">
          ← Back to Listings
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <ImageGallery images={images} />

            <div className="mt-6 flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <p className="text-3xl font-bold text-blue-600 mb-4">৳{post.price}</p>
              </div>
              <FavoriteButton postType="buysell" postId={post._id} />
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {post.location}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>👁️ {post.views || 0} views</span>
            </div>

            {/* Seller Information */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Seller Information</h2>
              <PosterInfo user={post.user} createdAt={post.createdAt} />

              {/* Contact Information */}
              {post.user?.phone && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Seller</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <a
                        href={`tel:${post.user.phone}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {post.user.phone}
                      </a>
                    </div>
                    <a
                      href={`tel:${post.user.phone}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isOwnPost && <MessageButton recipientId={post.user._id} />}
                    <DeleteButton
                      currentUser={currentUser}
                      contentOwner={post.user}
                      onDelete={handleDelete}
                      itemName="post"
                      size="md"
                    />
                    {!isOwnPost && post.user.email && (
                      <a
                        href={`mailto:${post.user.email}`}
                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </a>
                    )}
                  </div>
                  {isOwnPost && (
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">This is your post</p>
                    </div>
                  )}
                </div>
              )}

              {!post.user?.phone && !isOwnPost && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-1">No phone number available</p>
                      <p className="text-xs text-yellow-700">You can still send a message to the seller</p>
                      <div className="mt-3">
                        <MessageButton recipientId={post.user._id} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!post.user?.phone && isOwnPost && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800 mb-1">Add your phone number</p>
                      <p className="text-xs text-blue-700">Add a phone number to your profile so buyers can contact you easily</p>
                      {currentUser && (
                        <Link to={`/profile/${currentUser._id}`} className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Update Profile →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySellDetails; 