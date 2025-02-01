import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Borsa Premium Trade" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                Borsa Premium Trade
              </span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Yapay zeka destekli gelişmiş ticaret platformu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Hızlı Bağlantılar
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/markets" className="text-base text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Piyasalar
                </Link>
              </li>
              <li>
                <Link to="/trading" className="text-base text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  İşlem
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-base text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Destek
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Yardım Merkezi
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  API Dokümantasyonu
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Kullanım Koşulları
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              İletişim
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  destek@borsapremium.com
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  0850 123 45 67
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} Borsa Premium Trade. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;