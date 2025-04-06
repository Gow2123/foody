import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './suby/contexts/AuthContext'
import NavBar from './suby/components/NavBar'
import LandingPage from './suby/pages/LandingPage'
import Login from './suby/pages/Login'
import Signup from './suby/components/auth/Signup'
import RestaurantsPage from './suby/pages/RestaurantsPage'
import NotFound from './suby/pages/NotFound'
import ProtectedRoute from './suby/components/ProtectedRoute'
import ProfilePage from './suby/pages/ProfilePage'
import './App.css'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App