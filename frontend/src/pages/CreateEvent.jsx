import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: ''
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('date', formData.date);
        data.append('location', formData.location);
        images.forEach(img => data.append('images', img));

        try {
            await api.post('/events', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/events');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-4xl">📅</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Campus Event</h1>
                        <p className="text-gray-600">Share exciting events with the SUST community</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="e.g., Tech Fest 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Describe your event in detail..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">Select when your event will take place</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="e.g., SUST Auditorium, Room 301"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Images (up to 5, optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                />
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-5 gap-2">
                                        {imagePreviews.map((preview, idx) => (
                                            <div key={idx} className="relative">
                                                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Add photos to make your event more attractive</p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/events')}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition shadow-lg"
                                >
                                    {loading ? 'Creating...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default CreateEvent;
