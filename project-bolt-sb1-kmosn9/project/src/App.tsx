import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Markets from './pages/Markets';
import News from './pages/News';
import Trading from './pages/Trading';
import Login from './pages/Login';
import Register from './pages/Register';
import Wallet from './pages/Wallet';
import AdminPanel from './pages/AdminPanel';
import StockMarket from './pages/StockMarket';
import Verification from './pages/Verification';
import InstallPWA from './components/InstallPWA';
import LiveSupport from './components/LiveSupport';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user?.isAdmin ? <>{children}</> : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/borsa" element={<StockMarket />} />
            <Route path="/news" element={<News />} />
            <Route path="/trading" element={
              <PrivateRoute>
                <Trading />
              </PrivateRoute>
            } />
            <Route path="/wallet" element={
              <PrivateRoute>
                <Wallet />
              </PrivateRoute>
            } />
            <Route path="/verification" element={
              <PrivateRoute>
                <Verification />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <LiveSupport />
        <InstallPWA />
        <Footer />
      </div>
    </Router>
  );
};

export default App;