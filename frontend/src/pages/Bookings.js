import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiStar, FiMessageCircle, FiFileText, FiCalendar, FiXCircle, FiSearch, FiDownload, FiX } from 'react-icons/fi';
import { generateInvoicePDF, exportBookingsToCSV, exportBookingsToJSON } from '../utils/exportUtils';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, searchQuery]);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getAll();
      setBookings(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.workerId?.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    const loadingToast = toast.loading('Cancelling...');
    try {
      await bookingAPI.cancel(selectedBooking._id, { reason: cancellationReason });
      toast.success('Booking cancelled', { id: loadingToast });
      setShowCancelModal(false);
      setCancellationReason('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel', { id: loadingToast });
    }
  };

  const handleRescheduleBooking = async () => {
    if (!rescheduleDate) {
      toast.error('Please select a date');
      return;
    }
    const loadingToast = toast.loading('Rescheduling...');
    try {
      await bookingAPI.reschedule(selectedBooking._id, { scheduledDate: rescheduleDate });
      toast.success('Booking rescheduled', { id: loadingToast });
      setShowRescheduleModal(false);
      setRescheduleDate('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reschedule', { id: loadingToast });
    }
  };

  const handleRateBooking = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    const loadingToast = toast.loading('Submitting rating...');
    try {
      await bookingAPI.rate(selectedBooking._id, { rating, review });
      toast.success('Rating submitted successfully!', { id: loadingToast });
      setShowRatingModal(false);
      setRating(0);
      setReview('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to submit rating', { id: loadingToast });
    }
  };

  const handleDownloadInvoice = (booking) => {
    try {
      generateInvoicePDF(booking);
      toast.success('Invoice downloaded!');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  const handleExportCSV = () => {
    try {
      exportBookingsToCSV(filteredBookings);
      toast.success('Exported as CSV!');
    } catch (error) {
      toast.error('Failed to export');
    }
  };

  const handleExportJSON = () => {
    try {
      exportBookingsToJSON(filteredBookings);
      toast.success('Exported as JSON!');
    } catch (error) {
      toast.error('Failed to export');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      rescheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">My Bookings</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'completed').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search by service or worker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <FiDownload size={16} /> CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <FiDownload size={16} /> JSON
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{booking.service}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      Worker: <span className="font-semibold">{booking.workerId?.userId?.name}</span>
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
                    {booking.scheduledDate && (
                      <p className="text-purple-600 dark:text-purple-400 text-sm mt-1">
                        Scheduled: {new Date(booking.scheduledDate).toLocaleDateString('en-IN')}
                      </p>
                    )}
                    {booking.rating && (
                      <div className="flex items-center gap-1 text-yellow-500 mt-2">
                        {[...Array(booking.rating)].map((_, i) => (
                          <FiStar key={i} fill="currentColor" size={16} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-2xl font-bold text-blue-600">₹{booking.price}</div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/chat/${booking._id}`)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <FiMessageCircle size={16} /> Chat
                      </button>
                      {booking.status === 'completed' && !booking.rating && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowRatingModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                        >
                          <FiStar size={16} /> Rate
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadInvoice(booking)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <FiFileText size={16} /> Invoice
                      </button>
                      {(booking.status === 'pending' || booking.status === 'accepted') && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowRescheduleModal(true);
                            }}
                            className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                          >
                            <FiCalendar size={16} /> Reschedule
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            <FiXCircle size={16} /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Cancel Booking</h3>
              <button onClick={() => setShowCancelModal(false)}><FiX /></button>
            </div>
            <textarea
              placeholder="Reason for cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Reschedule Booking</h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-gray-500 dark:text-gray-400"><FiX size={24} /></button>
            </div>
            <input
              type="datetime-local"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRescheduleBooking}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Rate Worker</h3>
              <button onClick={() => setShowRatingModal(false)} className="text-gray-500 dark:text-gray-400"><FiX size={24} /></button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">How was your experience with {selectedBooking?.workerId?.userId?.name}?</p>
              <div className="flex gap-2 justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <FiStar
                      size={40}
                      className={star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
                      fill={star <= rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Write your review (optional)..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRateBooking}
                className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 font-semibold"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg"
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

export default Bookings;
