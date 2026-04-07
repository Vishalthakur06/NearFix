import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiZap, FiTool, FiHome as FiHomeIcon, FiTruck, FiPackage, FiDroplet } from 'react-icons/fi';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleServiceClick = (serviceName) => {
    if (user?.role === 'worker') {
      toast.error('Service providers cannot book services!');
      return;
    }
    navigate('/services', { state: { service: serviceName } });
  };

  const services = [
    { name: 'Electrician', icon: <FiZap className="text-4xl" />, color: 'from-yellow-400 to-orange-500' },
    { name: 'Plumber', icon: <FiDroplet className="text-4xl" />, color: 'from-blue-400 to-cyan-500' },
    { name: 'Cleaner', icon: <FiHomeIcon className="text-4xl" />, color: 'from-green-400 to-emerald-500' },
    { name: 'Driver', icon: <FiTruck className="text-4xl" />, color: 'from-purple-400 to-pink-500' },
    { name: 'Carpenter', icon: <FiTool className="text-4xl" />, color: 'from-amber-400 to-orange-600' },
    { name: 'Painter', icon: <FiPackage className="text-4xl" />, color: 'from-red-400 to-rose-500' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
              Welcome, {user?.name}! 👋
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 animate-slide-up">
              Find trusted service providers near you in seconds
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Our Services</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">Choose from our wide range of professional services</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div
                key={service.name}
                onClick={() => handleServiceClick(service.name)}
                className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">{service.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">Professional {service.name.toLowerCase()} services at your doorstep</p>
                <button className="text-blue-600 dark:text-blue-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform text-sm sm:text-base">
                  Book Now →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">1000+</h3>
                <p className="text-xs sm:text-sm md:text-base text-blue-100">Service Providers</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">5000+</h3>
                <p className="text-xs sm:text-sm md:text-base text-blue-100">Happy Customers</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">50+</h3>
                <p className="text-xs sm:text-sm md:text-base text-blue-100">Cities</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">4.8★</h3>
                <p className="text-xs sm:text-sm md:text-base text-blue-100">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">How It Works</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">Simple steps to get your work done</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4">1</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">Choose Service</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Select the service you need from our wide range</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4">2</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">Book Provider</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Choose from verified professionals near you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4">3</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">Get It Done</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Sit back and let professionals handle it</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
