import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

export const setupAdminAccount = async () => {
  try {
    // Önce admin hesabını oluşturmayı dene
    try {
      await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    } catch (error: any) {
      // Eğer hesap zaten varsa giriş yap
      if (error.code === 'auth/email-already-in-use') {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      } else {
        throw error;
      }
    }

    // Koleksiyonları oluştur
    const collections = [
      { name: 'users', initialDoc: { type: 'system', createdAt: new Date() } },
      { name: 'positions', initialDoc: { type: 'system', createdAt: new Date() } },
      { name: 'trades', initialDoc: { type: 'system', createdAt: new Date() } },
      { name: 'support_messages', initialDoc: { type: 'system', createdAt: new Date() } },
      { name: 'verification_documents', initialDoc: { type: 'system', createdAt: new Date() } }
    ];

    for (const col of collections) {
      const collectionRef = collection(db, col.name);
      const docs = await getDocs(collectionRef);
      
      // Koleksiyon boşsa başlangıç dokümanını oluştur
      if (docs.empty) {
        await setDoc(doc(collectionRef, 'system'), col.initialDoc);
      }
    }

    // Admin kullanıcı dokümanını oluştur/güncelle
    const adminDoc = {
      email: ADMIN_EMAIL,
      name: 'Admin',
      accountType: 'real',
      balance: 1000000,
      isAdmin: true,
      verificationStatus: 'verified',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    await setDoc(doc(db, 'users', auth.currentUser!.uid), adminDoc, { merge: true });

    console.log('Admin setup completed successfully');
  } catch (error) {
    console.error('Admin setup error:', error);
    throw error;
  }
};