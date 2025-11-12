import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import UnreadBadge from './UnreadBadge.jsx';
import NotificationCenter from './NotificationCenter.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <span className="text-white text-xl font-bold">Campus HUB</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/buysell" className="text-white hover:text-blue-100 transition font-medium">
              🛍️ Buy & Sell
            </Link>
            <Link to="/housing" className="text-white hover:text-blue-100 transition font-medium">
              🏠 Housing
            </Link>
            <Link to="/events" className="text-white hover:text-blue-100 transition font-medium">
              📅 Events
            </Link>
            <Link to="/study-groups" className="text-white hover:text-blue-100 transition font-medium">
              📚 Study
            </Link>
            <Link to="/jobs" className="text-white hover:text-blue-100 transition font-medium">
              💼 Jobs
            </Link>
            <Link to="/food" className="text-white hover:text-blue-100 transition font-medium">
              🍕 Food
            </Link>
            <Link to="/lost-found" className="text-white hover:text-blue-100 transition font-medium">
              🔍 Lost & Found
            </Link>

            {user ? (
              <>
                <Link to="/messages" className="text-white hover:text-blue-100 transition font-medium relative">
                  💬 Messages
                  <UnreadBadge />
                </Link>
                <Link to="/dashboard" className="text-white hover:text-blue-100 transition font-medium">
                  Dashboard
                </Link>
                <NotificationCenter />
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-100 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
