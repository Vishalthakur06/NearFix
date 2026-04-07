import { FiLoader } from 'react-icons/fi';

export const LoadingSpinner = ({ size = 48, text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <FiLoader className="animate-spin text-blue-600 mb-4" size={size} />
    <p className="text-gray-600 dark:text-gray-400">{text}</p>
  </div>
);

export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
    </div>
  </div>
);

export const ButtonLoader = () => (
  <div className="inline-flex items-center">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
    <span>Loading...</span>
  </div>
);
