// import React from 'react'
import './App.css'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './component/Home'
import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Eagerly loaded components (critical for initial render)
import Cart from './component/Cart'
import Login from './component/Login'
import Signup from './component/Signup'

// Lazy loaded components (can be loaded after initial render)
const Restaurants = lazy(() => import('./component/Restaurants'))
const Categories = lazy(() => import('./component/Categories'))
const MyOrders = lazy(() => import('./component/MyOrders'))
const Product = lazy(() => import('./component/Product'))
const RestaurantDetail = lazy(() => import('./component/RestaurantDetail'))
const CategoryDetail = lazy(() => import('./component/CategoryDetail'))
const Products = lazy(() => import('./component/Products'))
const AllProducts = lazy(() => import('./component/AllProducts'))

// Loading component for suspense
const PageLoading = () => (
  <div className="container mt-5 pt-5">
    <div className="text-center">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading page...</span>
      </div>
      <p className="mt-3">Loading content...</p>
    </div>
  </div>
);

function App() {  
  const [cart, setCart] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showScrollMessage, setShowScrollMessage] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    const handleScroll = () => {
      setShowScrollMessage(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    
    // Prefetch lazy components after the page has loaded
    const prefetchComponents = async () => {
      try {
        // Use setTimeout to defer prefetching until after initial page load
        setTimeout(async () => {
          if (navigator.connection && navigator.connection.saveData) {
            // Skip prefetching if the user has data-saving mode enabled
            return;
          }
          
          const componentsToPreload = [
            import('./component/Restaurants'),
            import('./component/Categories')
          ];
          
          await Promise.all(componentsToPreload);
        }, 2000);
      } catch (error) {
        console.error('Error prefetching components:', error);
      }
    };
    
    prefetchComponents();
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id)
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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

        {showScrollMessage && (
          <div className="position-fixed top-0 start-50 translate-middle-x mt-5 text-center text-white bg-success p-2 rounded">
            Work well, eat well, and be at peace.
          </div>
        )}

        <div className="main-content flex-grow-1 mt-5 pt-4">
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/product/:id" element={<Product addToCart={addToCart} />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail addToCart={addToCart} />} />
              <Route path="/category/:id" element={<CategoryDetail addToCart={addToCart} />} />
              <Route path="/products" element={<Products addToCart={addToCart} />} />
              <Route path="/all-products" element={<AllProducts addToCart={addToCart} />} />
              <Route 
                path="/cart" 
                element={
                  isLoggedIn ? (
                    <Cart
                      cart={cart}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/myorders" 
                element={
                  isLoggedIn ? (
                    <MyOrders />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              <Route 
                path="/login" 
                element={
                  isLoggedIn ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} />
                  )
                } 
              />
              <Route 
                path="/register" 
                element={
                  isLoggedIn ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Signup setIsLoggedIn={setIsLoggedIn} />
                  )
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
