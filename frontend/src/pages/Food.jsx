import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Food = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/food`);
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to load food orders:', err);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-12">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">🍕 Food & Dining</h1>
                        <p className="text-gray-600 mt-1">Share meals and split costs</p>
                    </div>
                    {user && (
                        <Link to="/food/create" className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition shadow-lg">
                            + Create Order
                        </Link>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map(order => (
                        <Link key={order._id} to={`/food/${order._id}`} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 block">
                            {order.image && <img src={order.image} alt={order.restaurant} className="w-full h-48 object-cover rounded-lg mb-4" />}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.orderType === 'group-order' ? 'bg-blue-100 text-blue-700' :
                                order.orderType === 'meal-sharing' ? 'bg-green-100 text-green-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {order.orderType.replace('-', ' ').toUpperCase()}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mt-3">{order.restaurant}</h3>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{order.description}</p>
                            {order.totalCost && <p className="text-2xl font-bold text-orange-600 mt-3">৳{order.totalCost}</p>}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <span className="text-sm text-gray-500">{order.participants.length} participants</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'open' ? 'bg-green-100 text-green-700' :
                                    order.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Food;
