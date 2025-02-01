import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Wallet as WalletIcon, CreditCard, ArrowDownCircle, ArrowUpCircle, Copy, CheckCircle, Send } from 'lucide-react';

const BANK_ACCOUNTS = [
  {
    bank: "Ziraat Bankası",
    iban: "TR33 0001 0002 3456 7890 1234 56",
    accountName: "Borsa Premium Trade A.Ş."
  },
  {
    bank: "Garanti Bankası",
    iban: "TR66 0006 2000 1234 5678 9012 34",
    accountName: "Borsa Premium Trade A.Ş."
  }
];

const CRYPTO_ADDRESSES = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  USDT: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
};

interface PaymentNotification {
  amount: string;
  bankName: string;
  senderName: string;
  reference: string;
  date: string;
}

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'crypto'>('bank');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentNotification, setPaymentNotification] = useState<PaymentNotification>({
    amount: '',
    bankName: '',
    senderName: '',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePaymentNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'payment_notifications'), {
        ...paymentNotification,
        userId: user?.id,
        userEmail: user?.email,
        status: 'pending',
        createdAt: new Date()
      });

      setShowPaymentForm(false);
      setPaymentNotification({
        amount: '',
        bankName: '',
        senderName: '',
        reference: '',
        date: new Date().toISOString().split('T')[0]
      });

      alert('Ödeme bildirimi başarıyla gönderildi. Admin onayından sonra bakiyeniz güncellenecektir.');
    } catch (error) {
      console.error('Payment notification error:', error);
      alert('Ödeme bildirimi gönderilirken bir hata oluştu.');
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-wallet-pattern bg-cover bg-center opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 shadow-lg mb-8">
          <div className="flex items-center mb-4">
            <WalletIcon className="h-8 w-8 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">Cüzdan</h1>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Güvenli ve hızlı para yatırma/çekme işlemleri, bakiye yönetimi ve işlem geçmişi.
          </p>
        </div>

        {/* Bakiye Kartı */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Bakiye</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₺{user.balance.toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  activeTab === 'deposit'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowDownCircle className="h-5 w-5 mr-2" />
                Para Yatır
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  activeTab === 'withdraw'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowUpCircle className="h-5 w-5 mr-2" />
                Para Çek
              </button>
            </div>
          </div>
        </div>

        {/* İşlem Seçenekleri */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                selectedMethod === 'bank'
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Banka Havalesi
            </button>
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                selectedMethod === 'crypto'
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <WalletIcon className="h-5 w-5 mr-2" />
              Kripto Para
            </button>
          </div>

          {selectedMethod === 'bank' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Banka Hesap Bilgileri
              </h3>
              {BANK_ACCOUNTS.map((account, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{account.bank}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400">{account.iban}</p>
                    <button
                      onClick={() => handleCopy(account.iban)}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      {copiedText === account.iban ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{account.accountName}</p>
                </div>
              ))}

              {/* Para Yatırma Bildirimi Butonu */}
              <div className="mt-6">
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Para Yatırdım, Bildir
                </button>
              </div>

              {/* Para Yatırma Bildirim Formu */}
              {showPaymentForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                  <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="mt-3">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Para Yatırma Bildirimi
                      </h3>
                      <form onSubmit={handlePaymentNotification} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Yatırılan Tutar (₺)
                          </label>
                          <input
                            type="number"
                            required
                            value={paymentNotification.amount}
                            onChange={(e) => setPaymentNotification(prev => ({
                              ...prev,
                              amount: e.target.value
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Gönderen Banka
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentNotification.bankName}
                            onChange={(e) => setPaymentNotification(prev => ({
                              ...prev,
                              bankName: e.target.value
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Gönderen Ad Soyad
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentNotification.senderName}
                            onChange={(e) => setPaymentNotification(prev => ({
                              ...prev,
                              senderName: e.target.value
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Referans/Açıklama
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentNotification.reference}
                            onChange={(e) => setPaymentNotification(prev => ({
                              ...prev,
                              reference: e.target.value
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            İşlem Tarihi
                          </label>
                          <input
                            type="date"
                            required
                            value={paymentNotification.date}
                            onChange={(e) => setPaymentNotification(prev => ({
                              ...prev,
                              date: e.target.value
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button
                            type="submit"
                            className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Gönder
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPaymentForm(false)}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            İptal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'crypto' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Kripto Para Adresleri
              </h3>
              {Object.entries(CRYPTO_ADDRESSES).map(([currency, address]) => (
                <div
                  key={currency}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2"
                >
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{currency} Adresi</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400 text-sm break-all">{address}</p>
                    <button
                      onClick={() => handleCopy(address)}
                      className="text-blue-600 hover:text-blue-500 ml-2 flex-shrink-0"
                    >
                      {copiedText === address ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              {activeTab === 'deposit' ? (
                <>
                  <strong>Önemli:</strong> Para yatırma işlemlerinizde açıklama kısmına üyelik numaranızı 
                  ({user.id}) yazmayı unutmayınız. İşlemleriniz ortalama 10-30 dakika içerisinde 
                  hesabınıza yansıyacaktır.
                </>
              ) : (
                <>
                  <strong>Önemli:</strong> Para çekme işlemleriniz iş günlerinde 09:00-17:00 saatleri 
                  arasında ortalama 30 dakika içerisinde işleme alınacaktır.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;