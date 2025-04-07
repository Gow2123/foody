import React, {useState, useEffect} from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Login from '../components/forms/Login'
import Register from '../components/forms/Register'
import AddFirm from '../components/forms/AddFirm'
import AddProduct from '../components/forms/AddProduct'
import Welcome from '../components/Welcome'
import AllProducts from '../components/AllProducts'


const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showFirm, setShowFirm] = useState(false)
  const [showProduct, setShowProduct] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false)
  const [showFirmTitle, setShowFirmTitle] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [authState, setAuthState] = useState({})

  useEffect(() => {
    checkAuth();
    
    // Debug key combo (press 'd' key three times quickly)
    let keyPresses = [];
    const keyHandler = (e) => {
      if (e.key === 'd') {
        keyPresses.push(Date.now());
        if (keyPresses.length > 3) keyPresses.shift();
        if (keyPresses.length === 3 && 
            keyPresses[2] - keyPresses[0] < 1000) {
          setShowDebug(prev => !prev);
        }
      }
    };
    
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

  const checkAuth = () => {
    const loginToken = localStorage.getItem('loginToken');
    const firmId = localStorage.getItem('firmId');
    const firmName = localStorage.getItem('firmName');
    
    // Save state for debugging
    setAuthState({
      loginToken: loginToken ? `${loginToken.substring(0, 10)}...` : null,
      firmId,
      firmName,
      localStorage: Object.keys(localStorage).map(key => key)
    });
    
    if (loginToken) {
      setShowLogOut(true);
      setIsLoggedIn(true);
      
      if (firmName || firmId) {
        setShowFirmTitle(false);
      } else {
        // User is logged in but has no firm
        setShowFirmTitle(true);
        // Show a message or redirect to add firm if needed
        if (!showFirm && !showRegister && !showLogin) {
          // Wait until component is mounted to avoid setState warnings
          setTimeout(() => {
            setShowFirm(true);
            setShowWelcome(false);
          }, 0);
        }
      }
      
      // Default to welcome screen when logged in if no other view is active
      if (!showFirm && !showProduct && !showAllProducts && !showLogin && !showRegister) {
        setShowWelcome(true);
      }
    } else {
      // Not logged in - show login screen
      setIsLoggedIn(false);
      setShowLogOut(false);
      setShowFirmTitle(true);
      if (!showRegister) {
        setShowLogin(true);
      }
    }
  };

  const logOutHandler = () => {
    const confirmed = confirm("Are you sure to logout?");
    if (confirmed) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("firmId");
      localStorage.removeItem('firmName');
      setShowLogOut(false);
      setShowFirmTitle(true);
      setShowWelcome(false);
      setIsLoggedIn(false);
      setShowLogin(true);
    }
  }

  const showLoginHandler = () => {
    setShowLogin(true)
    setShowRegister(false)
    setShowFirm(false)
    setShowProduct(false)
    setShowWelcome(false)
    setShowAllProducts(false)
  }

  const showRegisterHandler = () => {
    setShowRegister(true)
    setShowLogin(false)
    setShowFirm(false)
    setShowProduct(false)
    setShowWelcome(false)
    setShowAllProducts(false)
  }

  const showFirmHandler = () => {
    if (isLoggedIn) {
      setShowRegister(false)
      setShowLogin(false)
      setShowFirm(true)
      setShowProduct(false)
      setShowWelcome(false)
      setShowAllProducts(false)
    } else {
      alert("Please login first");
      setShowLogin(true)
    }
  }

  const showProductHandler = () => {
    if (isLoggedIn) {
      setShowRegister(false)
      setShowLogin(false)
      setShowFirm(false)
      setShowProduct(true)
      setShowWelcome(false)
      setShowAllProducts(false)
    } else {
      alert("Please login first");
      setShowLogin(true)
    }
  }

  const showWelcomeHandler = () => {
    setShowRegister(false)
    setShowLogin(false)
    setShowFirm(false)
    setShowProduct(false)
    setShowWelcome(true)
    setShowAllProducts(false)
    checkAuth();
  }

  const showAllProductsHandler = () => {
    if (isLoggedIn) {
      setShowRegister(false)
      setShowLogin(false)
      setShowFirm(false)
      setShowProduct(false)
      setShowWelcome(false)
      setShowAllProducts(true)
    } else {
      alert("Please login first");
      setShowLogin(true)
    }
  }

  return (
    <>
        <section className='landingSection'>
            <NavBar showLoginHandler = {showLoginHandler} showRegisterHandler = {showRegisterHandler}
            showLogOut = {showLogOut}
            logOutHandler = {logOutHandler}
            />
            <div className="collectionSection">
            <SideBar showFirmHandler={showFirmHandler} showProductHandler={showProductHandler}
            showAllProductsHandler={showAllProductsHandler}
            showFirmTitle={showFirmTitle}
            />
          {showFirm && isLoggedIn && <AddFirm />}
          {showProduct && isLoggedIn && <AddProduct />}
          {showWelcome && <Welcome />}
          {showAllProducts && isLoggedIn && <AllProducts />}
          {showLogin && !isLoggedIn && <Login showWelcomeHandler={showWelcomeHandler}/>}
          {showRegister && !isLoggedIn && <Register showLoginHandler={showLoginHandler}/>}
        
          {showDebug && (
            <div style={{
              position: 'fixed', 
              bottom: '10px', 
              right: '10px', 
              background: 'rgba(0,0,0,0.8)', 
              color: 'lime', 
              padding: '10px', 
              borderRadius: '5px',
              fontSize: '12px',
              fontFamily: 'monospace',
              maxWidth: '400px',
              zIndex: 9999
            }}>
              <h4>Auth Debug:</h4>
              <pre>{JSON.stringify(authState, null, 2)}</pre>
              <button onClick={checkAuth}>Refresh</button>
              <button onClick={() => setShowDebug(false)}>Close</button>
            </div>
          )}
            </div>
        </section>
    </>
  )
}

export default LandingPage