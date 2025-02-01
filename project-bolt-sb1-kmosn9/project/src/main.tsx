import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setupAdminAccount } from './services/setupAdmin';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Wait for auth to initialize before setting up admin
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Initialize admin account and collections only if no user is signed in
    setupAdminAccount()
      .then(() => {
        console.log('Admin setup completed successfully');
      })
      .catch(console.error);
  }
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);