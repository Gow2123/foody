import React from 'react'

const Welcome = () => {
  const vendorName = localStorage.getItem('firmName') || "Vendor";
  
  return (
    <div className="welcomeSection">
      <div className="welcome-content">
        <h1>Welcome to the Vendor Dashboard</h1>
        <h2>Hello, {vendorName}!</h2>
        <p>Manage your restaurant, products, and orders all in one place.</p>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">0</div>
            <div className="stat-label">Orders Today</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🍔</div>
            <div className="stat-value">0</div>
            <div className="stat-label">Active Products</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">4.8</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome