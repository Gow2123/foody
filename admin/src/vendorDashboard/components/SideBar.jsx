import React from "react";

const SideBar = ({
  showFirmHandler,
  showProductHandler,
  showAllProductsHandler,
  showFirmTitle
}) => {
  return (
    <div className="sideBarSection">
      <div className="sidebar-header">
        <h3>Dashboard</h3>
      </div>
      <ul>
        {showFirmTitle && (
          <li onClick={showFirmHandler}>
            <span className="sidebar-icon">🏪</span>
            Add Restaurant
          </li>
        )}
        
        <li onClick={showProductHandler}>
          <span className="sidebar-icon">🍔</span>
          Add Product
        </li>
        
        <li onClick={showAllProductsHandler}>
          <span className="sidebar-icon">📋</span>
          All Products
        </li>
        
        <li>
          <span className="sidebar-icon">👤</span>
          User Details
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
