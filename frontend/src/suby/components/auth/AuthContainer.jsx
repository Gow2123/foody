import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './Auth.css';

const AuthContainer = ({ setIsLoggedIn }) => {
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'signup'

  const switchToLogin = () => {
    setActiveForm('login');
  };

  const switchToSignup = () => {
    setActiveForm('signup');
  };

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button 
          className={`auth-tab ${activeForm === 'login' ? 'active' : ''}`} 
          onClick={switchToLogin}
        >
          Login
        </button>
        <button 
          className={`auth-tab ${activeForm === 'signup' ? 'active' : ''}`} 
          onClick={switchToSignup}
        >
          Sign Up
        </button>
      </div>
      
      <div className="auth-content">
        {activeForm === 'login' ? (
          <Login switchToSignup={switchToSignup} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Signup switchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthContainer; 