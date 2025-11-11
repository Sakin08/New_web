import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm.jsx';
import api from '../api/buysell.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const CreateBuySellPost = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await api.create(formData);
      navigate('/buysell');
    } catch (err) {
      alert('Failed to create post');
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Create Buy & Sell Post</h1>
        <PostForm type="buysell" onSubmit={handleSubmit} />
      </div>
    </ProtectedRoute>
  );
};

export default CreateBuySellPost;