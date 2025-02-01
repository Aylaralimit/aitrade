import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface VerificationDocument {
  type: 'identity' | 'drivingLicense' | 'passport' | 'addressProof';
  file: File | null;
  status: 'pending' | 'uploaded' | 'rejected';
}

const Verification: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserVerificationStatus } = useAuthStore();
  const [documents, setDocuments] = useState<Record<string, VerificationDocument>>({
    identity: { type: 'identity', file: null, status: 'pending' },
    drivingLicense: { type: 'drivingLicense', file: null, status: 'pending' },
    passport: { type: 'passport', file: null, status: 'pending' },
    addressProof: { type: 'addressProof', file: null, status: 'pending' }
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleFileUpload = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          file,
          status: 'uploaded'
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload each document to Firestore
      for (const [type, doc] of Object.entries(documents)) {
        if (doc.file) {
          await addDoc(collection(db, 'verification_documents'), {
            userId: user.id,
            userEmail: user.email,
            documentType: type,
            fileUrl: 'https://example.com/placeholder', // In a real app, you'd upload to storage
            status: 'pending',
            uploadedAt: new Date()
          });
        }
      }

      // Update user verification status
      await updateUserVerificationStatus(user.id, 'pending');
      navigate('/wallet');
    } catch (error) {
      console.error('Verification submission error:', error);
      alert('Doğrulama belgeleri gönderilirken bir hata oluştu.');
    }
  };

  const documentTypes = [
    {
      type: 'identity',
      title: 'Kimlik Kartı',
      description: 'Kimlik kartınızın ön ve arka yüzünün net bir fotoğrafını yükleyin.'
    },
    {
      type: 'drivingLicense',
      title: 'Ehliyet',
      description: 'Ehliyetinizin ön yüzünün net bir fotoğrafını yükleyin.'
    },
    {
      type: 'passport',
      title: 'Pasaport',
      description: 'Pasaportunuzun fotoğraflı sayfasının net bir görüntüsünü yükleyin.'
    },
    {
      type: 'addressProof',
      title: 'İkametgah',
      description: 'Son 3 aya ait bir fatura veya ikametgah belgesi yükleyin.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Hesap Doğrulama
        </h1>

        <div className="mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300">
              Gerçek hesap ile işlem yapabilmek için kimlik doğrulaması gereklidir. 
              Lütfen aşağıdaki belgelerden en az birini yükleyin.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {documentTypes.map(({ type, title, description }) => (
              <div
                key={type}
                className="border dark:border-gray-700 rounded-lg p-4 space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
                
                <div className="relative">
                  <input
                    type="file"
                    id={type}
                    accept="image/*,.pdf"
                    onChange={handleFileUpload(type)}
                    className="hidden"
                  />
                  <label
                    htmlFor={type}
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                      ${documents[type].status === 'uploaded'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400'
                      }`}
                  >
                    {documents[type].status === 'uploaded' ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                        <span className="text-sm text-green-600">
                          {documents[type].file?.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Dosya seçmek için tıklayın
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {documents[type].status === 'rejected' && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Belge reddedildi. Lütfen tekrar yükleyin.
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Doğrulama İçin Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verification;