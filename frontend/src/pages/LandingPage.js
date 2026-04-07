import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FiZap, FiTool, FiHome as FiHomeIcon, FiTruck, FiPackage, FiDroplet, FiArrowRight, FiCheckCircle, FiStar, FiUsers, FiShield, FiSun, FiMoon } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    { name: 'Electrician', icon: <FiZap className="text-3xl sm:text-4xl" />, color: 'from-yellow-400 to-orange-500' },
    { name: 'Plumber', icon: <FiDroplet className="text-3xl sm:text-4xl" />, color: 'from-blue-400 to-cyan-500' },
    { name: 'Cleaner', icon: <FiHomeIcon className="text-3xl sm:text-4xl" />, color: 'from-green-400 to-emerald-500' },
    { name: 'Driver', icon: <FiTruck className="text-3xl sm:text-4xl" />, color: 'from-purple-400 to-pink-500' },
    { name: 'Carpenter', icon: <FiTool className="text-3xl sm:text-4xl" />, color: 'from-amber-400 to-orange-600' },
    { name: 'Painter', icon: <FiPackage className="text-3xl sm:text-4xl" />, color: 'from-red-400 to-rose-500' }
  ];

  const features = [
    { icon: <FiCheckCircle />, title: 'Verified Professionals', desc: 'All workers are background verified' },
    { icon: <FiStar />, title: 'Top Rated', desc: '4.8+ average rating from customers' },
    { icon: <FiShield />, title: 'Secure & Safe', desc: 'Your safety is our priority' },
    { icon: <FiUsers />, title: '1000+ Workers', desc: 'Large network of professionals' }
  ];

  const handleServiceClick = (service) => {
    // Redirect to login with service info
    navigate('/login', { state: { redirectTo: '/services', service: service } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NearFix
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-800 dark:text-white hover:scale-110 transition-transform"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition">
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Find Local Service Providers
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
            Book trusted professionals for home services in seconds. Electricians, Plumbers, Cleaners & More!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              Book a Service Now
            </button>
            <button
              onClick={() => navigate('/register', { state: { role: 'worker' } })}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
            >
              Become a Worker
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl mx-auto mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Choose from our wide range of professional services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.name}
                onClick={() => handleServiceClick(service.name)}
                className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">{service.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                  Professional {service.name.toLowerCase()} services at your doorstep
                </p>
                <button className="text-blue-600 dark:text-blue-400 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                  Book Now <FiArrowRight className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">1000+</h3>
              <p className="text-sm sm:text-base text-blue-100">Service Providers</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">5000+</h3>
              <p className="text-sm sm:text-base text-blue-100">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">50+</h3>
              <p className="text-sm sm:text-base text-blue-100">Cities</p>
            </div>
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">4.8★</h3>
              <p className="text-sm sm:text-base text-blue-100">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Get your work done in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Choose Service</h3>
              <p className="text-gray-600 dark:text-gray-400">Select the service you need from our wide range</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Book Provider</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose from verified professionals near you</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Get It Done</h3>
              <p className="text-gray-600 dark:text-gray-400">Sit back and let professionals handle it</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers and find the perfect service provider today!
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
          >
            Sign Up Now - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 NearFix. All rights reserved. | Made with ❤️ in India</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
