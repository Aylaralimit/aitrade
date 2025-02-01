import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BarChart2, Users, Sun, Moon, Newspaper, Wallet, LogOut, Settings, LineChart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Borsa Premium Trade" 
                className="h-10 w-auto"
              />
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 text-transparent bg-clip-text">
                  Borsa Premium
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Trade Platform
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/markets" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <BarChart2 className="h-5 w-5 mr-1" />
              <span>Piyasalar</span>
            </Link>
            <Link to="/borsa" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <LineChart className="h-5 w-5 mr-1" />
              <span>Borsa</span>
            </Link>
            <Link to="/news" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Newspaper className="h-5 w-5 mr-1" />
              <span>Haberler</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/wallet" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Wallet className="h-5 w-5 mr-1" />
                  <span>Cüzdan</span>
                </Link>
                {user?.isAdmin && (
                  <Link to="/admin" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Settings className="h-5 w-5 mr-1" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-300">{user?.name}</span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded">
                    ₺{user?.balance.toLocaleString('tr-TR')}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    <span>Çıkış</span>
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Users className="h-5 w-5 mr-1" />
                <span>Giriş Yap</span>
              </Link>
            )}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Tema Değiştir"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              aria-label="Tema Değiştir"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/markets"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Piyasalar
            </Link>
            <Link
              to="/borsa"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Borsa
            </Link>
            <Link
              to="/news"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Haberler
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/wallet"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Cüzdan
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="px-3 py-2">
                  <span className="block text-base font-medium text-gray-700 dark:text-gray-200">
                    {user?.name}
                  </span>
                  <span className="mt-1 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded">
                    ₺{user?.balance.toLocaleString('tr-TR')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;