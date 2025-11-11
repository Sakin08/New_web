import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const Housing = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/housing').then(res => setPosts(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete this listing?')) {
      await api.delete(`/housing/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Housing & Roommates</h1>
        {user && <Link to="/housing/create" className="bg-blue-600 text-white px-4 py-2 rounded">+ New Listing</Link>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            type="housing"
            onDelete={post.user._id === user?._id ? handleDelete : null}
          />
        ))}
      </div>
    </div>
  );
};

export default Housing;