import React from 'react'

const NavBar = ({showLoginHandler, showRegisterHandler, showLogOut, logOutHandler}) => {
  const firmName = localStorage.getItem('firmName')

  return (
    <div className="navSection">
      <div className="logo">
        <img src="https://img.icons8.com/fluency/96/restaurant.png" alt="Food Logo" />
        <span className="company">Foody Admin</span>
      </div>
      
      <div className="firmName">
        {firmName && <h4>Restaurant: {firmName}</h4>}
      </div>
      
      <div className="userAuth">
        {!showLogOut ? (
          <div className="auth-buttons">
            <button className="login-button" onClick={showLoginHandler}>
              Login
            </button>
            <button className="register-button" onClick={showRegisterHandler}>
              Sign Up
            </button>
          </div>
        ) : (
          <span onClick={logOutHandler} className='logout'>
            Logout
          </span>
        )}
      </div>
    </div>
  )
}

export default NavBar