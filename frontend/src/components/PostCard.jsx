import { Link } from 'react-router-dom';

const PostCard = ({ post, type, onDelete }) => {
  const mainImage = type === 'buysell'
    ? (post.images?.[0] || post.image)
    : post.images?.[0];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {mainImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={post.title || 'Housing'}
            className="w-full h-full object-cover"
          />
          {type === 'housing' && post.roommatesNeeded && (
            <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {post.roommatesNeeded} roommate{post.roommatesNeeded > 1 ? 's' : ''} needed
            </div>
          )}
          {post.images?.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
              📷 {post.images.length}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {type === 'buysell' ? (
          <>
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">৳{post.price}</p>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {post.location}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-2xl text-blue-600">৳{post.rent}<span className="text-sm text-gray-600">/month</span></h3>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {post.address}
            </div>
            {post.phone && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {post.phone}
              </div>
            )}
          </>
        )}

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <Link
            to={`/${type}/${post._id}`}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(post._id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;