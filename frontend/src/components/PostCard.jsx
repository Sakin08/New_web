import { Link } from 'react-router-dom';

const PostCard = ({ post, type, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      {post.image && type === 'buysell' && <img src={post.image} alt="" className="w-full h-48 object-cover rounded" />}
      <h3 className="font-bold text-lg mt-2">{post.title || `৳${post.rent}/month`}</h3>
      <p className="text-sm text-gray-600">{post.location || post.address}</p>
      <p className="text-sm mt-1">{post.description.substring(0, 100)}...</p>
      <div className="mt-3 flex justify-between">
        <Link to={`/${type}/${post._id}`} className="text-blue-600">View →</Link>
        {onDelete && <button onClick={() => onDelete(post._id)} className="text-red-500">Delete</button>}
      </div>
    </div>
  );
};

export default PostCard;