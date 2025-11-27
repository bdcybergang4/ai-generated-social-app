import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          SocialApp
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Link
              to="/feed"
              className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              Feed
            </Link>
            <Link
              to="/profile"
              className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              My Profile
            </Link>
            <Link
              to="/edit-profile"
              className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              Settings
            </Link>
            <span className="border-l border-white pl-6">
              {user?.username && <span>Welcome, {user.username}!</span>}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/signin"
              className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-white text-blue-500 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
