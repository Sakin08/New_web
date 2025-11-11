import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm.jsx';
import housingApi from '../api/housing.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const CreateHousingPost = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await housingApi.create(formData);
      navigate('/housing');
    } catch (err) {
      alert('Failed to create listing: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Create Housing Listing</h1>
        <PostForm type="housing" onSubmit={handleSubmit} />
      </div>
    </ProtectedRoute>
  );
};

export default CreateHousingPost;