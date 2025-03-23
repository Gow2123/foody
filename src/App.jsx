// import React from 'react'
import './App.css'
import Navbar from './component/Navbar'
import FoodCards from './component/FoodCards'
import Login from './component/Login'
import Signup from './component/Signup'
import Restaurants from './component/Restaurants'
import Categories from './component/Categories'
import MyOrders from './component/MyOrders'
import { useState } from 'react'

function App() {  
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage} />;
      case 'restaurants':
        return <Restaurants />;
      case 'categories':
        return <Categories />;
      case 'myorders':
        return <MyOrders />;
      default:
        return <FoodCards />;
    }
  };

  return (
    <>
      <Navbar setCurrentPage={setCurrentPage} />
      {renderPage()}
    </>
  )
}

export default App
