// Login component with colorful design

function Login({ setCurrentPage }) {
  return (
    <div className="container mt-3 pt-2">
      <div className="row">
        <div className="col-md-6 mb-4">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop" className="img-fluid rounded shadow" alt="Food Banner" />
          <div className="row mt-3">
            <div className="col-6">
              <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1471&auto=format&fit=crop" className="img-fluid rounded shadow" style={{height: "150px", objectFit: "cover"}} alt="Delivery" />
            </div>
            <div className="col-6">
              <img src="https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1470&auto=format&fit=crop" className="img-fluid rounded shadow" style={{height: "150px", objectFit: "cover"}} alt="Offers" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow border-0" style={{background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"}}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <img src="https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1480&auto=format&fit=crop" className="img-fluid rounded-circle border border-danger border-3 mb-3" width="100" height="100" style={{objectFit: "cover"}} alt="Logo" />
                <h2 className="text-danger fw-bold">Welcome Back!</h2>
                <p className="text-muted">Login to your Foody account</p>
              </div>
              
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold text-dark">Email address</label>
                  <input type="email" className="form-control form-control-lg border-danger" id="email" placeholder="Enter your email" />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold text-dark">Password</label>
                  <input type="password" className="form-control form-control-lg border-danger" id="password" placeholder="Enter your password" />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-danger btn-lg fw-bold">LOGIN</button>
                </div>
                <div className="text-center mt-4">
                  <p>{"Don't"} have an account? <a href="#" className="text-danger fw-bold text-decoration-none" onClick={() => setCurrentPage('signup')}>Sign Up</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 