import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar sticky-top">
      <div className="container-xl">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="sleep-tracker-logo">Sleep Tracker</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="navbar-link">Home</Link>
            
            {currentUser ? (
              <>
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/log-sleep" className="navbar-link">Log Sleep</Link>
                <Link to="/analytics" className="navbar-link">Analytics</Link>
                <Link to="/tips" className="navbar-link">Tips</Link>
                <div className="relative group">
                  <button className="flex items-center navbar-link cursor-pointer">
                    {currentUser.name || 'Account'}
                  </button>
                  <div className="dropdown-menu opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100">Profile</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/register" className="navbar-button">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-indigo-500 slide-in-down">
            <Link to="/" className="block py-2 hover:bg-indigo-700 px-4 rounded" onClick={toggleMobileMenu}>Home</Link>
            
            {currentUser ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:bg-indigo-700 px-4 rounded" onClick={toggleMobileMenu}>Dashboard</Link>
                <Link to="/log-sleep" className="block py-2 hover:bg-indigo-700 px-4 rounded" onClick={toggleMobileMenu}>Log Sleep</Link>
                <Link to="/analytics" className="block py-2 hover:bg-indigo-700 px-4 rounded" onClick={toggleMobileMenu}>Analytics</Link>
                <Link to="/tips" className="block py-2 hover:bg-indigo-700 px-4 rounded" onClick={toggleMobileMenu}>Tips</Link>
                <div className="font-medium px-4 py-2">
                  {currentUser.name || 'Account'}
                </div>
                <Link to="/profile" className="block py-2 hover:bg-indigo-700 px-8 ml-2 rounded text-gray-300" onClick={toggleMobileMenu}>
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left py-2 hover:bg-indigo-700 px-4 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:bg-indigo-700 px-4 rounded" onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" className="block py-2 hover:bg-indigo-700 px-4 rounded" onClick={toggleMobileMenu}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
