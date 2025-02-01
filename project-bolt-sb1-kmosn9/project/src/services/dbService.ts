import { db } from './firebase';
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { User } from '../types/auth';

export const dbService = {
  getUserById: async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      return {
        id: userDoc.id,
        ...userDoc.data(),
        balance: userDoc.data()?.balance || 0,
        verificationStatus: userDoc.data()?.verificationStatus || 'unverified'
      } as User;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          balance: doc.data()?.balance || 0,
          verificationStatus: doc.data()?.verificationStatus || 'unverified'
        } as User))
        .filter(user => !user.isAdmin);
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
      
      // Güncellenmiş kullanıcı verisini al
      const updatedDoc = await getDoc(userRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        balance: updatedDoc.data()?.balance || 0,
        verificationStatus: updatedDoc.data()?.verificationStatus || 'unverified'
      } as User;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }
};