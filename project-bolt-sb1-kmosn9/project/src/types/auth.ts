import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  accountType: 'demo' | 'real';
  balance: number;
  createdAt: Date;
  lastLogin: Date;
  isAdmin?: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  createDemoAccount: () => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  updateUserBalance: (userId: string, amount: number) => Promise<void>;
  updateUserVerificationStatus: (userId: string, status: 'verified' | 'rejected', documents?: any) => Promise<void>;
  addSupportMessage: (message: SupportMessage) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  accountType: 'demo' | 'real';
}

export interface SupportMessage {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: 'new' | 'processing' | 'resolved';
}