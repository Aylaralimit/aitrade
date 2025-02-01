import React from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Wallet, Calendar, Clock } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
          <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Bakiye</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ₺{user.balance.toLocaleString('tr-TR')}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Hesap Türü</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {user.accountType === 'demo' ? 'Demo Hesap' : 'Gerçek Hesap'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            Kayıt Tarihi
          </div>
          <span className="text-gray-900 dark:text-white">
            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-2" />
            Son Giriş
          </div>
          <span className="text-gray-900 dark:text-white">
            {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;