import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthContainer = ({ setIsLoggedIn }) => {
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'signup'

  const switchToLogin = () => {
    setActiveForm('login');
  };

  const switchToSignup = () => {
    setActiveForm('signup');
  };

  return (
    <div>
      {activeForm === 'login' ? (
        <Login switchToSignup={switchToSignup} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Signup switchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthContainer; 