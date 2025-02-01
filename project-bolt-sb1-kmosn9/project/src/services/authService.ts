import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export const authService = {
  register: async (email: string, password: string, name: string, accountType: 'demo' | 'real') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        email,
        name,
        accountType,
        balance: accountType === 'demo' ? 100000 : 0,
        verificationStatus: accountType === 'real' ? 'unverified' : 'verified',
        isAdmin: false,
        createdAt: new Date(),
        lastLogin: new Date(),
        loginHistory: [{
          timestamp: new Date(),
          ip: '127.0.0.1',
          device: navigator.userAgent
        }]
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      return {
        id: user.uid,
        ...userData
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      const loginHistory = userData.loginHistory || [];
      
      loginHistory.push({
        timestamp: new Date(),
        ip: '127.0.0.1',
        device: navigator.userAgent
      });

      // Keep only last 10 logins
      const updatedHistory = loginHistory.slice(-10);

      await setDoc(userRef, {
        ...userData,
        lastLogin: serverTimestamp(),
        loginHistory: updatedHistory
      }, { merge: true });

      return {
        id: user.uid,
        ...userData,
        lastLogin: new Date(),
        loginHistory: updatedHistory
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};