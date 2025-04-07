import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './suby/contexts/AuthContext'
import NavBar from './suby/components/NavBar'
import LandingPage from './suby/pages/LandingPage'
import AuthPage from './suby/pages/AuthPage'
import RestaurantsPage from './suby/pages/RestaurantsPage'
import RestaurantMenu from './suby/pages/RestaurantMenu'
import NotFound from './suby/pages/NotFound'
import ProtectedRoute from './suby/components/ProtectedRoute'
import ProfilePage from './suby/pages/ProfilePage'
import CartPage from './suby/pages/CartPage'
import OrdersPage from './suby/pages/OrdersPage'
import './App.css'

// Placeholder components for pages not yet implemented
const AboutPage = () => <div className="page-content"><h1>About Us</h1></div>;
const ContactPage = () => <div className="page-content"><h1>Contact Us</h1></div>;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/restaurant/:id" element={<RestaurantMenu />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App
