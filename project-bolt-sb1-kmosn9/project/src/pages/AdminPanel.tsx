import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTradingStore } from '../store/tradingStore';
import { User, Shield, Users, Wallet, CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import type { User as UserType } from '../types/auth';
import type { Position } from '../types/trading';
import { TRADING_INSTRUMENTS } from '../types/trading';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user: currentUser, getAllUsers, updateUserBalance, updateUserVerificationStatus } = useAuthStore();
  const { positions, executeOrder, closePosition } = useTradingStore();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'trades' | 'payments' | 'verifications'>('users');
  const [paymentNotifications, setPaymentNotifications] = useState<any[]>([]);
  const [verificationDocuments, setVerificationDocuments] = useState<any[]>([]);
  const [tradeForm, setTradeForm] = useState({
    symbol: TRADING_INSTRUMENTS.stocks[0].symbol,
    type: 'long' as 'long' | 'short',
    amount: ''
  });

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers.filter(user => user !== null && typeof user === 'object'));

        // Get pending payment notifications
        const paymentsSnapshot = await getDocs(
          query(collection(db, 'payment_notifications'), 
          where('status', '==', 'pending'))
        );
        setPaymentNotifications(paymentsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })));

        // Get pending verification documents
        const verificationsSnapshot = await getDocs(
          query(collection(db, 'verification_documents'), 
          where('status', '==', 'pending'))
        );
        setVerificationDocuments(verificationsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })));

      } catch (error) {
        console.error('Data fetch error:', error);
        setError('Veriler alınırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [currentUser, navigate, getAllUsers]);

  const handleBalanceUpdate = async (userId: string) => {
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount)) {
      setError('Lütfen geçerli bir miktar girin');
      return;
    }

    try {
      await updateUserBalance(userId, amount);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, balance: amount } : user
      ));
      setBalanceAmount('');
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      console.error('Balance update error:', err);
      setError('Bakiye güncellenirken bir hata oluştu');
    }
  };

  const handlePaymentApproval = async (paymentId: string, approved: boolean) => {
    try {
      const paymentRef = doc(db, 'payment_notifications', paymentId);
      const payment = paymentNotifications.find(p => p.id === paymentId);
      
      if (!payment) return;

      await updateDoc(paymentRef, {
        status: approved ? 'approved' : 'rejected',
        processedAt: new Date()
      });

      if (approved) {
        // Update user balance
        const userRef = doc(db, 'users', payment.userId);
        const userDoc = await getDocs(query(collection(db, 'users'), where('id', '==', payment.userId)));
        const userData = userDoc.docs[0]?.data();

        if (userData) {
          await updateDoc(userRef, {
            balance: userData.balance + parseFloat(payment.amount)
          });
        }
      }

      // Update notifications list
      setPaymentNotifications(prev => prev.filter(p => p.id !== paymentId));
    } catch (error) {
      console.error('Payment approval error:', error);
      setError('Ödeme onaylanırken bir hata oluştu');
    }
  };

  const handleVerificationApproval = async (docId: string, approved: boolean) => {
    try {
      const docRef = doc(db, 'verification_documents', docId);
      const verificationDoc = verificationDocuments.find(d => d.id === docId);
      
      if (!verificationDoc) return;

      await updateDoc(docRef, {
        status: approved ? 'approved' : 'rejected',
        processedAt: new Date()
      });

      if (approved) {
        // Update user verification status
        const userRef = doc(db, 'users', verificationDoc.userId);
        await updateDoc(userRef, {
          verificationStatus: 'verified'
        });
      }

      // Update verification documents list
      setVerificationDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (error) {
      console.error('Verification approval error:', error);
      setError('Doğrulama işlemi sırasında bir hata oluştu');
    }
  };

  const handleTrade = async (userId: string) => {
    try {
      if (!tradeForm.amount || isNaN(parseFloat(tradeForm.amount))) {
        setError('Geçerli bir işlem miktarı girin');
        return;
      }

      await executeOrder(
        tradeForm.symbol,
        parseFloat(tradeForm.amount),
        tradeForm.type,
        userId
      );

      setTradeForm(prev => ({
        ...prev,
        amount: ''
      }));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'İşlem açılırken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Users className="h-5 w-5 mr-2" />
              Kullanıcılar
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`${
                activeTab === 'trades'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              İşlemler
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Wallet className="h-5 w-5 mr-2" />
              Ödemeler
              {paymentNotifications.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                  {paymentNotifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`${
                activeTab === 'verifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Shield className="h-5 w-5 mr-2" />
              Doğrulamalar
              {verificationDocuments.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                  {verificationDocuments.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hesap Türü
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bakiye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doğrulama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.accountType === 'real'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.accountType === 'real' ? 'Gerçek' : 'Demo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{user.balance?.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.verificationStatus === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : user.verificationStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.verificationStatus === 'verified'
                          ? 'Onaylı'
                          : user.verificationStatus === 'pending'
                          ? 'Beklemede'
                          : 'Onaylanmamış'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                      {selectedUser?.id === user.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={balanceAmount}
                            onChange={(e) => setBalanceAmount(e.target.value)}
                            className="w-24 px-2 py-1 border rounded"
                            placeholder="Miktar"
                          />
                          <button
                            onClick={() => handleBalanceUpdate(user.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Güncelle
                          </button>
                          <button
                            onClick={() => setSelectedUser(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Bakiye Güncelle
                        </button>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setActiveTab('trades');
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          İşlemleri Gör
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === 'trades' && selectedUser && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedUser.name} - İşlemler
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Geri Dön
                </button>
              </div>

              {/* Trading Form */}
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={tradeForm.symbol}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, symbol: e.target.value }))}
                    className="block w-full rounded-md border-gray-300"
                  >
                    {Object.entries(TRADING_INSTRUMENTS).map(([market, instruments]) => (
                      <optgroup key={market} label={market === 'stocks' ? 'Hisseler' : market === 'crypto' ? 'Kripto' : 'Emtia'}>
                        {instruments.map(instrument => (
                          <option key={instrument.symbol} value={instrument.symbol}>
                            {instrument.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={tradeForm.amount}
                    onChange={(e) => setTradeForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Miktar (₺)"
                    className="block w-full rounded-md border-gray-300"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setTradeForm(prev => ({ ...prev, type: 'long' }));
                        handleTrade(selectedUser.id);
                      }}
                      className="flex-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <TrendingUp className="h-5 w-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => {
                        setTradeForm(prev => ({ ...prev, type: 'short' }));
                        handleTrade(selectedUser.id);
                      }}
                      className="flex-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <TrendingDown className="h-5 w-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Positions List */}
            <div className="px-6 py-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sembol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miktar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giriş Fiyatı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {positions
                    .filter(p => p.userId === selectedUser.id)
                    .map((position) => (
                      <tr key={position.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {position.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            position.type === 'long'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {position.type === 'long' ? 'UZUN' : 'KISA'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          ₺{position.amount.toLocaleString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          ₺{position.entryPrice.toLocaleString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => closePosition(position.id!, selectedUser.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Pozisyonu Kapat
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Bekleyen Ödeme Bildirimleri
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {paymentNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Bekleyen ödeme bildirimi bulunmuyor
                </div>
              ) : (
                paymentNotifications.map((payment) => (
                  <div key={payment.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.userEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          Miktar: ₺{parseFloat(payment.amount).toLocaleString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Banka: {payment.bankName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Gönderen: {payment.senderName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Referans: {payment.reference}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tarih: {new Date(payment.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePaymentApproval(payment.id, true)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Onayla
                        </button>
                        <button
                          onClick={() => handlePaymentApproval(payment.id, false)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reddet
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Bekleyen Doğrulama İstekleri
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {verificationDocuments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Bekleyen doğrulama isteği bulunmuyor
                </div>
              ) : (
                verificationDocuments.map((doc) => (
                  <div key={doc.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Kullanıcı ID: {doc.userId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Belge Türü: {doc.documentType}
                        </p>
                        <div className="mt-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500"
                          >
                            Belgeyi Görüntüle
                          </a>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerificationApproval(doc.id, true)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Onayla
                        </button>
                        <button
                          onClick={() => handleVerificationApproval(doc.id, false)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reddet
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;