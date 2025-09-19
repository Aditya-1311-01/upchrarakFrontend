import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Import pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import History from './pages/History';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LocalHospitals from './pages/LocalHospitals';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import utilities
import { isAuthenticated } from './utils/auth';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Auth Route Component (redirect if already logged in)
const AuthRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Toaster />
        <Sonner />
        
        {/* Navbar - only show on protected routes */}
        {isAuthenticated() && <Navbar />}
        
        {/* Main content */}
        <main className="flex-1">
          <Routes>
            {/* Auth routes */}
            <Route 
              path="/login" 
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/LocalHospitals" 
              element={
                <ProtectedRoute>
                  <LocalHospitals />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer - only show on protected routes */}
        {isAuthenticated() && <Footer />}
      </div>
    </Router>
  );
};

export default App;