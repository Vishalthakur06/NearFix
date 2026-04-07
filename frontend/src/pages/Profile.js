import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI, userAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiCamera, FiEdit2, FiMapPin, FiPhone, FiMail, FiStar, FiClock, FiDownload, FiFileText, FiX, FiCalendar, FiXCircle, FiMessageCircle } from 'react-icons/fi';
import { generateInvoicePDF, exportBookingsToCSV, exportBookingsToJSON } from '../utils/exportUtils';

const Profile = () => {
  const { user, logout, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookings();
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) setProfileImage(savedImage);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      city: user?.city || ''
    });
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getAll();
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
        toast.success('Profile picture updated! 📸');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    const loadingToast = toast.loading('Cancelling booking...');
    try {
      await bookingAPI.cancel(selectedBooking._id, { reason: cancellationReason });
      toast.success('Booking cancelled successfully! ❌', { id: loadingToast });
      setShowCancelModal(false);
      setCancellationReason('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking', { id: loadingToast });
    }
  };

  const handleRescheduleBooking = async () => {
    if (!rescheduleDate) {
      toast.error('Please select a date');
      return;
    }

    const loadingToast = toast.loading('Rescheduling booking...');
    try {
      await bookingAPI.reschedule(selectedBooking._id, { scheduledDate: rescheduleDate });
      toast.success('Booking rescheduled successfully! 📅', { id: loadingToast });
      setShowRescheduleModal(false);
      setRescheduleDate('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reschedule booking', { id: loadingToast });
    }
  };

  const handleDownloadInvoice = (booking) => {
    try {
      generateInvoicePDF(booking);
      toast.success('Invoice downloaded! 📄');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate invoice. Please try again.');
    }
  };

  const handleExportCSV = () => {
    try {
      exportBookingsToCSV(bookings);
      toast.success('Bookings exported as CSV! 📊');
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error('Failed to export CSV. Please try again.');
    }
  };

  const handleExportJSON = () => {
    try {
      exportBookingsToJSON(bookings);
      toast.success('Bookings exported as JSON! 📦');
    } catch (error) {
      console.error('JSON export error:', error);
      toast.error('Failed to export JSON. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    const loadingToast = toast.loading('Updating profile...');
    try {
      await userAPI.updateProfile(formData);
      if (formData.city) localStorage.setItem('userCity', formData.city);
      await refreshUser();
      toast.success('Profile updated successfully! ✅', { id: loadingToast });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile', { id: loadingToast });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'rescheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                <FiCamera className="text-white" size={20} />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{user?.name}</h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold">
                  {user?.role}
                </span>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                  <FiPhone size={18} />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                  <FiMail size={18} />
                  <span>{user?.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                  <FiMapPin size={18} />
                  <span>{user?.city || 'Not provided'}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mx-auto md:mx-0"
              >
                <FiEdit2 /> <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white text-center">
                <div className="text-3xl font-bold">{bookings.length}</div>
                <div className="text-sm text-blue-100">Total Bookings</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white text-center">
                <div className="text-3xl font-bold">{bookings.filter(b => b.status === 'completed').length}</div>
                <div className="text-sm text-purple-100">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {['Indore','Mumbai','Delhi','Bangalore','Pune','Ahmedabad','Jaipur','Lucknow','Bhopal','Kolkata'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  handleSaveProfile();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Cancel Booking</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to cancel this booking for <strong>{selectedBooking?.service}</strong>?
            </p>
            
            <textarea
              placeholder="Please provide a reason for cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
              rows="4"
            />
            
            <div className="flex space-x-4">
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Confirm Cancel
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Reschedule Booking</h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Select a new date for <strong>{selectedBooking?.service}</strong>
            </p>
            
            <input
              type="datetime-local"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
            />
            
            <div className="flex space-x-4">
              <button
                onClick={handleRescheduleBooking}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Confirm Reschedule
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
