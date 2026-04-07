import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workerAPI, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiDollarSign, FiStar, FiToggleLeft, FiToggleRight, FiClock, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await workerAPI.getProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await workerAPI.getBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAvailability = async () => {
    const loadingToast = toast.loading('Updating availability...');
    try {
      const { data } = await workerAPI.updateAvailability({ isAvailable: !profile.isAvailable });
      setProfile(data);
      toast.success(data.isAvailable ? 'You are now online! 🟢' : 'You are now offline 🔴', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to update availability', { id: loadingToast });
    }
  };

  const handleUpdateSkills = async (skill) => {
    const newSkills = profile.skills?.includes(skill)
      ? profile.skills.filter(s => s !== skill)
      : [...(profile.skills || []), skill];
    try {
      await workerAPI.updateSkills({ skills: newSkills });
      setProfile(prev => ({ ...prev, skills: newSkills }));
      toast.success('Skills updated!');
    } catch (error) {
      toast.error('Failed to update skills');
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    setLoading(true);
    const loadingToast = toast.loading('Accepting booking...');
    try {
      await bookingAPI.updateStatus(bookingId, { status: 'accepted' });
      toast.success('Booking accepted successfully! ✅', { id: loadingToast });
      fetchBookings();
    } catch (error) {
      toast.error('Failed to accept booking', { id: loadingToast });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectBooking = async (bookingId) => {
    setLoading(true);
    const loadingToast = toast.loading('Rejecting booking...');
    try {
      await bookingAPI.updateStatus(bookingId, { status: 'cancelled' });
      toast.error('Booking rejected ❌', { id: loadingToast });
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reject booking', { id: loadingToast });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    setLoading(true);
    const loadingToast = toast.loading('Completing booking...');
    try {
      await bookingAPI.updateStatus(bookingId, { status: 'completed' });
      toast.success('Booking completed! 🎉 Earnings updated', { id: loadingToast });
      fetchBookings();
      fetchProfile();
    } catch (error) {
      toast.error('Failed to complete booking', { id: loadingToast });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 sm:mb-8">Worker Dashboard</h1>

        {/* Stats Cards */}
        {profile && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign size={24} className="sm:w-8 sm:h-8" />
                <span className="text-xs sm:text-sm bg-blue-400 px-2 sm:px-3 py-1 rounded-full">Total</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1">₹{profile.earnings}</div>
              <div className="text-blue-100 text-xs sm:text-sm">Total Earnings</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiStar size={32} />
                <span className="text-sm bg-yellow-400 px-3 py-1 rounded-full">Rating</span>
              </div>
              <div className="text-3xl font-bold mb-1">{profile.rating.toFixed(1)} ⭐</div>
              <div className="text-yellow-100 text-sm">{profile.totalRatings} Reviews</div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiCheckCircle size={32} />
                <span className="text-sm bg-purple-400 px-3 py-1 rounded-full">Status</span>
              </div>
              <div className="text-3xl font-bold mb-1">{profile.isApproved ? 'Approved' : 'Pending'}</div>
              <div className="text-purple-100 text-sm">Account Status</div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiClock size={32} />
                <span className="text-sm bg-green-400 px-3 py-1 rounded-full">Jobs</span>
              </div>
              <div className="text-3xl font-bold mb-1">{bookings.length}</div>
              <div className="text-green-100 text-sm">Total Bookings</div>
            </div>
          </div>
        )}

        {/* Availability Toggle */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Availability Status</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.isAvailable ? 'You are currently online and accepting jobs' : 'You are currently offline'}
                </p>
              </div>
              <button
                onClick={toggleAvailability}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  profile.isAvailable 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white'
                }`}
              >
                {profile.isAvailable ? <FiToggleRight size={28} /> : <FiToggleLeft size={28} />}
                <span>{profile.isAvailable ? 'Online' : 'Offline'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Skills */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">My Skills</h3>
            <div className="flex flex-wrap gap-3">
              {['Electrician','Plumber','Cleaner','Driver','Carpenter','Painter'].map(skill => (
                <button
                  key={skill}
                  onClick={() => handleUpdateSkills(skill)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                    profile.skills?.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Job Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Job Requests</h3>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-lg">No job requests yet</p>
              <p className="text-sm">Turn on availability to start receiving jobs</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking._id} className="border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{booking.service}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        Customer: <span className="font-semibold">{booking.userId?.name}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{booking.price}</div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => navigate(`/chat/${booking._id}`)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          <FiMessageCircle size={16} />
                          <span>Chat</span>
                        </button>
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleAcceptBooking(booking._id)}
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleRejectBooking(booking._id)}
                              disabled={loading}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {booking.status === 'accepted' && (
                          <button 
                            onClick={() => handleCompleteBooking(booking._id)}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkerDashboard;
