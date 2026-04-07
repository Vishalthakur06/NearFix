import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiPhone, FiLock, FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const loadingToast = toast.loading('Logging in...');
    try {
      const { data } = await authAPI.login({ phone, password });
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}! 👋`, { id: loadingToast });
      
      // Redirect based on role or state
      if (location.state?.redirectTo) {
        navigate(location.state.redirectTo, { state: location.state });
      } else if (data.user.role === 'worker') {
        navigate('/worker/dashboard');
      } else if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed', { id: loadingToast });
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:scale-110 transition-transform z-50"
      >
        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
      <div className="w-full max-w-md">
        {/* Logo - Clickable to go back to landing page */}
        <div className="text-center mb-6 sm:mb-8">
          <div 
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 mb-3 sm:mb-4 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">N</span>
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-white">NearFix</span>
          </div>
          <p className="text-white text-base sm:text-lg">Welcome back! Please login to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center">Login</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              <FiArrowRight />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
              <Link to="/" className="hover:text-blue-600 transition">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 text-center text-white">
          <div>
            <div className="text-xl sm:text-2xl font-bold">1000+</div>
            <div className="text-xs sm:text-sm text-blue-100">Workers</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold">5000+</div>
            <div className="text-xs sm:text-sm text-blue-100">Customers</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold">4.8★</div>
            <div className="text-xs sm:text-sm text-blue-100">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
