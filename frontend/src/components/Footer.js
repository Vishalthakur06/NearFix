import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* About */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">N</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">NearFix</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Your trusted platform for finding nearby service providers. Quick, reliable, and professional services at your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/services" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Services</Link></li>
              <li><Link to="/about" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">Electrician</li>
              <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">Plumber</li>
              <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">Cleaner</li>
              <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer">Driver</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center justify-center md:justify-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <FiMail className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={16} />
                <span className="break-all">support@nearfix.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <FiPhone className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={16} />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <FiMapPin className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={16} />
                <span>Indore, India</span>
              </li>
            </ul>
            {/* Social Media */}
            <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4 mt-3 sm:mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition">
                <FiFacebook size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-400 hover:text-white transition">
                <FiTwitter size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-pink-600 hover:text-white transition">
                <FiInstagram size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-700 hover:text-white transition">
                <FiLinkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            © 2024 NearFix. All rights reserved. | Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
