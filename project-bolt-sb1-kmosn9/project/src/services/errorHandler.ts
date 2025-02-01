import { FirebaseError } from 'firebase/app';

export const handleFirebaseError = (error: FirebaseError | any) => {
  // Firebase hata kodlarını kullanıcı dostu mesajlara çevir
  const errorMessages: Record<string, string> = {
    'permission-denied': 'Bu işlem için yetkiniz bulunmuyor.',
    'not-found': 'İstenilen veri bulunamadı.',
    'already-exists': 'Bu kayıt zaten mevcut.',
    'resource-exhausted': 'İşlem limiti aşıldı.',
    'failed-precondition': 'İşlem şartları sağlanamadı.',
    'invalid-argument': 'Geçersiz işlem parametreleri.',
    'unavailable': 'Servis şu anda kullanılamıyor.',
    'deadline-exceeded': 'İşlem zaman aşımına uğradı.'
  };

  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: errorMessages[error.code] || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      original: error
    };
  }

  return {
    code: 'unknown',
    message: 'Beklenmeyen bir hata oluştu.',
    original: error
  };
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) break;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw handleFirebaseError(lastError);
};