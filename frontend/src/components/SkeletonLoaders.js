// Skeleton Loaders for different components

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-4"></div>
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
  </div>
);

export const WorkerCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="flex space-x-2 mb-4">
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const BookingCardSkeleton = () => (
  <div className="border dark:border-gray-700 rounded-xl p-6 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="text-right">
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
    </div>
    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
  </div>
);

export const ListSkeleton = ({ count = 3 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="border dark:border-gray-700 rounded-xl p-4 animate-pulse">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    ))}
  </>
);
