import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import ActivityFeed from '../components/ActivityFeed.jsx';
import TrendingSection from '../components/TrendingSection.jsx';

const Home = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ posts: 0, housing: 0, events: 0 });
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [postsRes, housingRes, eventsRes] = await Promise.all([
                api.get('/buysell'),
                api.get('/housing'),
                api.get('/events')
            ]);

            setStats({
                posts: postsRes.data.length,
                housing: housingRes.data.length,
                events: eventsRes.data.length
            });

            setRecentPosts(postsRes.data.slice(0, 6));
            setLoading(false);
        } catch (err) {
            console.error('Failed to load data:', err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome to Campus HUB</h1>
                    <p className="text-xl mb-8 text-blue-100">
                        Your one-stop platform for SUST student community
                    </p>
                    {!user ? (
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition"
                            >
                                Sign In
                            </Link>
                        </div>
                    ) : (
                        <p className="text-2xl">Welcome back, {user.name}! 👋</p>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                {/* Trending and Activity */}
                {user && (
                    <div className="mb-16">
                        <TrendingSection />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Access</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Link to="/buysell" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                                        <div className="text-3xl mb-2">🛍️</div>
                                        <h3 className="font-bold text-gray-900">Buy & Sell</h3>
                                        <p className="text-sm text-gray-600 mt-1">{stats.posts} listings</p>
                                    </Link>
                                    <Link to="/housing" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                                        <div className="text-3xl mb-2">🏠</div>
                                        <h3 className="font-bold text-gray-900">Housing</h3>
                                        <p className="text-sm text-gray-600 mt-1">{stats.housing} available</p>
                                    </Link>
                                    <Link to="/events" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                                        <div className="text-3xl mb-2">📅</div>
                                        <h3 className="font-bold text-gray-900">Events</h3>
                                        <p className="text-sm text-gray-600 mt-1">{stats.events} upcoming</p>
                                    </Link>
                                </div>
                            </div>
                            <ActivityFeed />
                        </div>
                    </div>
                )}

                {!user && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <Link to="/buysell" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-3xl">🛍️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Buy & Sell</h3>
                            <p className="text-gray-600 mb-4">Find great deals on books, electronics, and more</p>
                            <div className="text-blue-600 font-semibold">{stats.posts} active listings</div>
                        </Link>

                        <Link to="/housing" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-3xl">🏠</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Housing</h3>
                            <p className="text-gray-600 mb-4">Find roommates and affordable accommodation</p>
                            <div className="text-green-600 font-semibold">{stats.housing} available</div>
                        </Link>

                        <Link to="/events" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-3xl">📅</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Events</h3>
                            <p className="text-gray-600 mb-4">Stay updated with campus activities</p>
                            <div className="text-purple-600 font-semibold">{stats.events} upcoming</div>
                        </Link>
                    </div>
                )}  {/* ✅ FIXED: closed the conditional block properly */}

                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Recent Listings</h2>
                            <Link to="/buysell" className="text-blue-600 hover:text-blue-700 font-semibold">
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentPosts.map(post => (
                                <Link
                                    key={post._id}
                                    to={`/buysell/${post._id}`}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                                >
                                    {post.image && (
                                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
                                        <p className="text-2xl font-bold text-blue-600">৳{post.price}</p>
                                        <p className="text-sm text-gray-500 mt-2">{post.location}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">Join the SUST Community Today</h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Connect with fellow students, buy and sell items, find housing, and more!
                        </p>
                        <Link
                            to="/register"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg inline-block"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
