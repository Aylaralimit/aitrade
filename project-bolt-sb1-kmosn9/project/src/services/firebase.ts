import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSSHxm4ETNf3fa38w8FO5tcWu9GAzWSR0",
  authDomain: "finance-api-4da78.firebaseapp.com",
  databaseURL: "https://finance-api-4da78-default-rtdb.firebaseio.com",
  projectId: "finance-api-4da78",
  storageBucket: "finance-api-4da78.firebasestorage.app",
  messagingSenderId: "274132877910",
  appId: "1:274132877910:web:b11c9d419726ca8bd2f1f7",
  measurementId: "G-PJQ4F2KD46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firestore with persistence
const initializeFirestore = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Firestore persistence enabled');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  }
};

initializeFirestore().catch(console.error);

export default app;