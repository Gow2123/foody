// import React from 'react'
import PropTypes from 'prop-types';
function Navbar({ setCurrentPage }) {
  return (
    <><nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
    <div className="container-fluid">
      <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => setCurrentPage('home')}>
        <img src="https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1480&auto=format&fit=crop" 
          className="rounded-circle me-2" width="30" height="30" style={{objectFit: "cover"}} alt="Logo" />
        Foody
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarScroll">
        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ "--bs-scroll-height": "100px" }}>
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#" onClick={() => setCurrentPage('home')}>Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => setCurrentPage('restaurants')}>Restaurants</a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Categories
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#" onClick={() => setCurrentPage('categories')}>All Categories</a></li>
              <li><hr className="dropdown-divider"/></li>
              <li><a className="dropdown-item" href="#">Pizza</a></li>
              <li><a className="dropdown-item" href="#">Burgers</a></li>
              <li><a className="dropdown-item" href="#">Sushi</a></li>
              <li><a className="dropdown-item" href="#">Desserts</a></li>
            </ul>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={() => setCurrentPage('myorders')}>My Orders</a>
          </li>
        </ul>
        <div className="d-flex align-items-center">
          <form className="d-flex me-3" role="search">
            <input className="form-control me-2" type="search" placeholder="Search for food..." aria-label="Search"></input>
            <button className="btn btn-outline-danger" type="submit">Search</button>
          </form>
          <button className="btn btn-danger ms-2" onClick={() => setCurrentPage('login')}>
            Login / Profile
          </button>
        </div>
      </div>
    </div>
  </nav></>
  ) 
}

Navbar.propTypes = {
  setCurrentPage: PropTypes.func.isRequired
};

export default Navbar
