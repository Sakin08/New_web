import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/buysell.js';
import MessageButton from '../components/MessageButton.jsx';
import ImageGallery from '../components/ImageGallery.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';

const BuySellDetails = () => {
  const { id } = useParams();
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

  const images = post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : []);

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

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Seller Information</h2>
              <div className="flex items-center space-x-4">
                {post.user.profilePicture ? (
                  <img
                    src={post.user.profilePicture}
                    alt={post.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{post.user.name}</p>
                  <p className="text-sm text-gray-600">{post.user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>👁️ {post.views || 0} views</span>
              <span>Posted {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <MessageButton postOwnerId={post.user._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySellDetails;
