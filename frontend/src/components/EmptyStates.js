import { FiInbox, FiUsers, FiCalendar, FiAlertCircle } from 'react-icons/fi';

export const EmptyBookings = ({ message = "No bookings yet" }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
      <FiCalendar className="text-gray-400 dark:text-gray-600" size={48} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{message}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      Start booking services to see your history here
    </p>
  </div>
);

export const EmptyWorkers = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
      <FiUsers className="text-gray-400 dark:text-gray-600" size={48} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
      No Workers Available
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      No service providers found nearby. Try again later or check another service.
    </p>
  </div>
);

export const EmptyState = ({ icon: Icon = FiInbox, title, description }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon className="text-gray-400 dark:text-gray-600" size={48} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export const ErrorState = ({ message = "Something went wrong" }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
      <FiAlertCircle className="text-red-600 dark:text-red-400" size={48} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Oops!</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Try Again
    </button>
  </div>
);
