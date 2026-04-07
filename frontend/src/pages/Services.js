import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { workerAPI, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiStar, FiMapPin, FiCheck, FiLoader } from 'react-icons/fi';

const Services = () => {
  const location = useLocation();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user?.role === 'worker') {
      toast.error('Service providers cannot book services!');
      return;
    }
    if (location.state?.worker) {
      // Direct worker from search
      setWorkers([location.state.worker]);
      setLoading(false);
    } else if (location.state?.service) {
      fetchWorkers(location.state.service);
    }
  }, [location.state]);

  const fetchWorkers = async (service) => {
    setLoading(true);
    try {
      const userCity = localStorage.getItem('userCity');
      const { data } = await workerAPI.getNearby({ service, city: userCity });
      setWorkers(data);
    } catch (error) {
      toast.error('Failed to fetch workers');
    }
    setLoading(false);
  };

  const handleBooking = async (worker) => {
    if (user?.role === 'worker') {
      toast.error('Service providers cannot book services!');
      return;
    }
    const loadingToast = toast.loading('Creating booking request...');
    try {
      await bookingAPI.create({
        workerId: worker._id,
        service: location.state?.service || worker.skills?.[0] || 'General',
        location: { lat: 0, lng: 0 },
        price: 500
      });
      toast.success(`Booking request sent to ${worker.userId.name}! 🎉`, { id: loadingToast });
    } catch (error) {
      toast.error('Booking failed. Please try again.', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Available {location.state?.service}s
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Find verified professionals near you</p>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">Finding workers near you...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Workers Available</h3>
            <p className="text-gray-600 dark:text-gray-400">No {location.state?.service}s found nearby. Try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {workers.map(worker => (
              <div key={worker._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Worker Image */}
                <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl sm:text-5xl md:text-6xl font-bold">
                  {worker.userId?.name?.charAt(0).toUpperCase()}
                </div>
                
                {/* Worker Info */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-1 truncate">
                        {worker.userId?.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <FiStar fill="currentColor" size={16} />
                        <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                          {worker.rating.toFixed(1)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          ({worker.totalRatings} reviews)
                        </span>
                      </div>
                    </div>
                    {worker.isApproved && (
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full flex-shrink-0">
                        <FiCheck className="text-green-600 dark:text-green-400" size={16} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <FiMapPin size={16} className="flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Near your location</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.map(skill => (
                        <span key={skill} className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 sm:pt-4 border-t dark:border-gray-700 gap-3 sm:gap-0">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">₹500</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Starting price</div>
                    </div>
                    <button
                      onClick={() => handleBooking(worker)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 text-sm sm:text-base"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Services;
