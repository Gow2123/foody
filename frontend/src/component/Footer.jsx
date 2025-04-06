import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="footer__brand">Foody</h5>
            <p className="text--muted">Delicious food delivered to your doorstep</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none">Home</Link></li>
              <li><Link to="/restaurants" className="text-decoration-none">Restaurants</Link></li>
              <li><Link to="/categories" className="text-decoration-none">Categories</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <p className="text--muted">Email: support@foody.com</p>
            <p className="text--muted">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-center">
            <p className="text--muted mb-0">© 2024 Foody. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 