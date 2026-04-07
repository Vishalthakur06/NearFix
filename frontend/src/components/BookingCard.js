import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiCalendar } from 'react-icons/fi';

const BookingCard = ({ booking, onAction }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-600" size={20} />;
      case 'accepted':
        return <FiCheckCircle className="text-blue-600" size={20} />;
      case 'pending':
        return <FiClock className="text-yellow-600" size={20} />;
      case 'cancelled':
        return <FiXCircle className="text-red-600" size={20} />;
      case 'rescheduled':
        return <FiCalendar className="text-purple-600" size={20} />;
      default:
        return <FiAlertCircle className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300';
      case 'rescheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '✅ Completed';
      case 'accepted': return '🔵 Accepted';
      case 'pending': return '⏳ Pending';
      case 'cancelled': return '❌ Cancelled';
      case 'rescheduled': return '📅 Rescheduled';
      default: return status;
    }
  };

  return (
    <div className="relative">
      {/* New Badge for pending bookings */}
      {booking.status === 'pending' && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="relative flex h-8 w-8">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-yellow-500 text-white text-xs font-bold items-center justify-center">
              NEW
            </span>
          </span>
        </div>
      )}

      {/* Status Badge with Icon */}
      <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getStatusColor(booking.status)}`}>
        {getStatusIcon(booking.status)}
        <span>{getStatusText(booking.status)}</span>
      </div>
    </div>
  );
};

export default BookingCard;
