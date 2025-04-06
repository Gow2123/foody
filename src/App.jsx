<<<<<<< HEAD
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
=======
// import React from 'react'
import './App.css'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './component/Home'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Import components
import Cart from './component/Cart'
import Login from './component/Login'
import Signup from './component/Signup'
import Restaurants from './component/Restaurants'
import Categories from './component/Categories'
import MyOrders from './component/MyOrders'
import Product from './component/Product'
import RestaurantDetail from './component/RestaurantDetail'
import CategoryDetail from './component/CategoryDetail'
import Products from './component/Products'
import AllProducts from './component/AllProducts'

function App() {  
  const [cart, setCart] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id)
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, product]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar 
          cartCount={cart.length}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />

        <div className="main-content flex-grow-1 mt-5 pt-4">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<Product addToCart={addToCart} />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail addToCart={addToCart} />} />
            <Route path="/category/:id" element={<CategoryDetail addToCart={addToCart} />} />
            <Route path="/products/category/:id" element={<CategoryDetail addToCart={addToCart} />} />
            <Route path="/products" element={<Products addToCart={addToCart} />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/cart" element={isLoggedIn ? <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} /> : <Navigate to="/login" />} />
            <Route path="/myorders" element={isLoggedIn ? <MyOrders /> : <Navigate to="/login" />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Signup setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
>>>>>>> cf1045ebb630a0c60ae2426bae9db992338c77f4
