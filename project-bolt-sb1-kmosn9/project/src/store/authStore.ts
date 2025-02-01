import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, RegisterData, User, SupportMessage } from '../types/auth';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null });
        try {
          const userData = await authService.login(credentials.email, credentials.password);
          set({
            user: userData,
            isAuthenticated: true,
            loading: false
          });

          // Kullanıcı verilerini dinlemeye başla
          const unsubscribe = onSnapshot(doc(db, 'users', userData.id), (doc) => {
            if (doc.exists()) {
              set(state => ({
                ...state,
                user: {
                  ...state.user!,
                  ...doc.data(),
                  id: doc.id
                }
              }));
            }
          });

          return () => unsubscribe();
        } catch (error) {
          set({ error: 'Giriş başarısız', loading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ loading: true, error: null });
        try {
          const userData = await authService.register(data.email, data.password, data.name, data.accountType);
          set({
            user: userData,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          set({ error: 'Kayıt başarısız', loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },

      getAllUsers: async () => {
        try {
          const users = await dbService.getAllUsers();
          return users;
        } catch (error) {
          console.error('Get users error:', error);
          return [];
        }
      },

      updateUserBalance: async (userId: string, amount: number) => {
        try {
          await dbService.updateUser(userId, { balance: amount });
          
          // Eğer güncellenen kullanıcı mevcut kullanıcı ise state'i güncelle
          const state = get();
          if (state.user?.id === userId) {
            set({
              user: {
                ...state.user,
                balance: amount
              }
            });
          }

          // Kullanıcı verilerini yeniden getir
          const updatedUser = await dbService.getUserById(userId);
          return updatedUser;
        } catch (error) {
          console.error('Update balance error:', error);
          throw error;
        }
      },

      updateUserVerificationStatus: async (userId: string, status: 'verified' | 'rejected') => {
        try {
          await dbService.updateUser(userId, { verificationStatus: status });
          
          // Kullanıcı verilerini yeniden getir
          const updatedUser = await dbService.getUserById(userId);
          return updatedUser;
        } catch (error) {
          console.error('Update verification status error:', error);
          throw error;
        }
      },

      addSupportMessage: async (message: SupportMessage) => {
        try {
          await dbService.createSupportMessage(message);
        } catch (error) {
          console.error('Add support message error:', error);
          throw error;
        }
      },

      createDemoAccount: async () => {
        set({ loading: true, error: null });
        try {
          const demoData: RegisterData = {
            email: `demo${Math.random().toString(36).substr(2, 6)}@example.com`,
            password: Math.random().toString(36).substr(2, 12),
            name: 'Demo Trader',
            accountType: 'demo'
          };
          
          const userData = await authService.register(
            demoData.email,
            demoData.password,
            demoData.name,
            demoData.accountType
          );
          
          set({
            user: userData,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          set({ error: 'Demo hesap oluşturulamadı', loading: false });
          throw error;
        }
      },

      refreshUserData: async () => {
        const state = get();
        if (state.user?.id) {
          try {
            const updatedUser = await dbService.getUserById(state.user.id);
            set({ user: updatedUser });
          } catch (error) {
            console.error('Refresh user data error:', error);
          }
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);