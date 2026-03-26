import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const PublicNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">BotForge</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </Link>

            <Link
              to="/pricing"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link>

            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/pricing"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 py-6 space-y-2">
            <Link
              to="/features"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/pricing"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <Link
                  to="/dashboard"
                  className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-center text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/get-started"
                    className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
