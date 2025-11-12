import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const LostFound = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { user } = useAuth();

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/lost-found`);
            setItems(res.data);
        } catch (err) {
            console.error('Failed to load items:', err);
        }
        setLoading(false);
    };

    const filteredItems = items.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-12">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">🔍 Lost & Found</h1>
                        <p className="text-gray-600 mt-1">Help reunite people with their belongings</p>
                    </div>
                    {user && (
                        <Link to="/lost-found/create" className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-lg">
                            + Report Item
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <div className="flex gap-2">
                        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All Items</button>
                        <button onClick={() => setFilter('lost')} className={`px-4 py-2 rounded-lg font-medium ${filter === 'lost' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>❌ Lost</button>
                        <button onClick={() => setFilter('found')} className={`px-4 py-2 rounded-lg font-medium ${filter === 'found' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>✅ Found</button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map(item => (
                        <Link key={item._id} to={`/lost-found/${item._id}`} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden block">
                            <div className={`h-2 ${item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            {item.images?.[0] && <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {item.type === 'lost' ? '❌ LOST' : '✅ FOUND'}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{item.category}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {item.location}
                                </div>
                                <div className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</div>
                                <div className={`mt-4 pt-4 border-t text-center ${item.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                                    {item.status === 'active' ? '🟢 Active' : '⚪ Resolved'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LostFound;
