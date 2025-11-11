// Example: How to update your Navbar.jsx to include Messages link with unread badge

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import UnreadBadge from './UnreadBadge.jsx';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Campus HUB</Link>

                <div className="flex gap-6 items-center">
                    <Link to="/buysell">Buy & Sell</Link>
                    <Link to="/housing">Housing</Link>
                    <Link to="/events">Events</Link>

                    {user ? (
                        <>
                            <Link to="/messages" className="relative">
                                Messages
                                <UnreadBadge />
                            </Link>
                            <Link to="/dashboard">Dashboard</Link>
                            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
