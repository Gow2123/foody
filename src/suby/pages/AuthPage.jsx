import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/auth/AuthContainer';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  // If user logs in successfully, this function will be called
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <AuthContainer setIsLoggedIn={handleLoginSuccess} />
    </div>
  );
};

export default AuthPage; 