import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useEffect, useRef } from 'react';
import { workerAPI } from '../services/api';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiBriefcase, FiSearch } from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (user) {
      socket.emit('join', user._id);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length < 2) { setSearchResults([]); return; }
    try {
      const { data } = await workerAPI.search(val);
      setSearchResults(data);
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NearFix
            </span>
          </Link>

          {/* Search Bar - Center Left, Wide */}
          {user?.role === 'user' && (
            <div className="relative flex-grow max-w-xl" ref={searchRef}>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 bg-gray-50 dark:bg-gray-800">
                <FiSearch className="text-gray-400 mr-2 flex-shrink-0" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setShowSearch(true)}
                  placeholder="Search workers by name..."
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none w-full"
                />
              </div>
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50">
                  {searchResults.map(worker => (
                    <div
                      key={worker._id}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                        navigate('/services', { state: { worker, service: worker.skills?.[0] } });
                      }}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700 last:border-0 flex items-center space-x-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {worker.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white">{worker.userId?.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{worker.skills?.join(', ')} • {worker.userId?.city}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showSearch && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50 px-4 py-3 text-sm text-gray-500">
                  No workers found
                </div>
              )}
            </div>
          )}

          {/* Right Side Nav */}
          <div className="flex items-center space-x-3 ml-auto">

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-4">
              {user?.role === 'user' && (
                <>
                  <Link to="/home" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    <FiHome size={16} /> <span>Home</span>
                  </Link>
                  <Link to="/bookings" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                    <FiBriefcase size={16} /> <span>My Bookings</span>
                  </Link>
                </>
              )}
              {user?.role === 'worker' && (
                <Link to="/worker/dashboard" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                  <FiBriefcase size={16} /> <span>Dashboard</span>
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium">
                  <FiBriefcase size={16} /> <span>Admin</span>
                </Link>
              )}
            </div>

            {/* Notification Bell */}
            <NotificationDropdown socket={socket} />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{user?.name}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700">
                  <div className="px-4 py-2 border-b dark:border-gray-700">
                    <div className="font-semibold text-gray-800 dark:text-white">{user?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</div>
                  </div>
                  <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FiUser size={16} /> <span>My Account</span>
                  </Link>
                  <div className="border-t dark:border-gray-700 my-1"></div>
                  <button onClick={handleLogout} className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FiLogOut size={16} /> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t dark:border-gray-700 pt-4 space-y-2">
            {user?.role === 'user' && (
              <Link to="/home" className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"><FiHome /> <span>Home</span></Link>
            )}
            <Link to="/profile" className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"><FiUser /> <span>My Account</span></Link>
            {user?.role === 'worker' && (
              <Link to="/worker/dashboard" className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"><FiBriefcase /> <span>Dashboard</span></Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"><FiBriefcase /> <span>Admin</span></Link>
            )}
            <button onClick={handleLogout} className="flex items-center space-x-2 py-2 text-red-600 dark:text-red-400 w-full"><FiLogOut /> <span>Logout</span></button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
