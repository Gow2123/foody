// Restaurants component using FoodCards style with different layout

function Restaurants() {
  return (
    <div className="container mt-3 pt-2">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-danger fw-bold mb-4">All Restaurants</h2>
          
          {/* Filter and sorting options */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-lg-3 mb-2 mb-lg-0">
                  <select className="form-select border-danger">
                    <option>Filter by cuisine</option>
                    <option>Pizza</option>
                    <option>Burgers</option>
                    <option>Sushi</option>
                    <option>Desserts</option>
                  </select>
                </div>
                <div className="col-md-6 col-lg-3 mb-2 mb-lg-0">
                  <select className="form-select border-danger">
                    <option>Sort by</option>
                    <option>Rating (highest first)</option>
                    <option>Delivery time (fastest first)</option>
                    <option>Distance (nearest first)</option>
                  </select>
                </div>
                <div className="col-md-6 col-lg-3 mb-2 mb-lg-0">
                  <select className="form-select border-danger">
                    <option>Delivery time</option>
                    <option>Under 30 min</option>
                    <option>30-45 min</option>
                    <option>45-60 min</option>
                  </select>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="freeDelivery" />
                    <label className="form-check-label" htmlFor="freeDelivery">Free delivery only</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Popular Restaurants - FoodCards style */}
          <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="position-relative">
                  <img src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "200px", objectFit: "cover"}} alt="Pizza Restaurant" />
                  <span className="position-absolute top-0 end-0 badge bg-danger m-2 px-2 py-1">20% OFF</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Pizza Heaven</h5>
                  <p className="card-text">Authentic Italian pizzas made in wood-fired ovens with the freshest ingredients.</p>
                  <p className="mb-0 text-muted"><small>🍕 Italian, Pizza, Fast Food</small></p>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                  <small className="text-danger fw-bold">4.8 ★ • 30-45 min</small>
                  <button className="btn btn-sm btn-outline-danger">View Menu</button>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="position-relative">
                  <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1471&auto=format&fit=crop" className="card-img-top" style={{height: "200px", objectFit: "cover"}} alt="Burger Restaurant" />
                  <span className="position-absolute top-0 end-0 badge bg-danger m-2 px-2 py-1">Free Delivery</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Burger Blast</h5>
                  <p className="card-text">Juicy, mouthwatering burgers with a variety of toppings and sides.</p>
                  <p className="mb-0 text-muted"><small>🍔 American, Burgers, Fast Food</small></p>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                  <small className="text-danger fw-bold">4.6 ★ • 20-35 min</small>
                  <button className="btn btn-sm btn-outline-danger">View Menu</button>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow border-0">
                <div className="position-relative">
                  <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "200px", objectFit: "cover"}} alt="Sushi Restaurant" />
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">Sushi Palace</h5>
                  <p className="card-text">Fresh and delicious sushi prepared by expert chefs using premium ingredients.</p>
                  <p className="mb-0 text-muted"><small>🍣 Japanese, Sushi, Seafood</small></p>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                  <small className="text-danger fw-bold">4.9 ★ • 40-55 min</small>
                  <button className="btn btn-sm btn-outline-danger">View Menu</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Restaurants - Featured deals style */}
          <h3 className="mb-3 text-danger fw-bold">Featured Restaurants</h3>
          <div className="row mb-5">
            <div className="col-md-6 mb-3">
              <div className="card shadow border-0">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src="https://images.unsplash.com/photo-1551326844-4df70f78d0e9?q=80&w=1376&auto=format&fit=crop" className="img-fluid rounded-start" style={{height: "100%", objectFit: "cover"}} alt="Mexican Restaurant" />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title fw-bold">Taco Fiesta</h5>
                        <span className="badge bg-success">4.5 ★</span>
                      </div>
                      <p className="card-text">Authentic Mexican cuisine with fresh ingredients and traditional recipes.</p>
                      <p className="text-muted mb-2"><small>🌮 Mexican, Tacos, Burritos • 25-40 min</small></p>
                      <a href="#" className="btn btn-danger">Order Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-3">
              <div className="card shadow border-0">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1374&auto=format&fit=crop" className="img-fluid rounded-start" style={{height: "100%", objectFit: "cover"}} alt="Italian Restaurant" />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title fw-bold">Pasta Paradise</h5>
                        <span className="badge bg-success">4.7 ★</span>
                      </div>
                      <p className="card-text">Delicious Italian pasta dishes made with premium ingredients.</p>
                      <p className="text-muted mb-2"><small>🍝 Italian, Pasta, Mediterranean • 35-50 min</small></p>
                      <a href="#" className="btn btn-danger">Order Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More Restaurants - Compact grid */}
          <h3 className="mb-3 text-danger fw-bold">More Options</h3>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            <div className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="row g-0">
                  <div className="col-4">
                    <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1364&auto=format&fit=crop" className="img-fluid rounded-start" style={{height: "100%", objectFit: "cover"}} alt="Dessert Shop" />
                  </div>
                  <div className="col-8">
                    <div className="card-body py-2">
                      <h6 className="card-title fw-bold mb-1">Sweet Delights</h6>
                      <p className="card-text mb-1"><small>🍰 Desserts, Bakery</small></p>
                      <p className="mb-0"><small className="text-danger">4.8 ★ • 15-30 min</small></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="row g-0">
                  <div className="col-4">
                    <img src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1325&auto=format&fit=crop" className="img-fluid rounded-start" style={{height: "100%", objectFit: "cover"}} alt="Indian Restaurant" />
                  </div>
                  <div className="col-8">
                    <div className="card-body py-2">
                      <h6 className="card-title fw-bold mb-1">Curry House</h6>
                      <p className="card-text mb-1"><small>🍛 Indian, Curry</small></p>
                      <p className="mb-0"><small className="text-danger">4.6 ★ • 30-45 min</small></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="row g-0">
                  <div className="col-4">
                    <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1374&auto=format&fit=crop" className="img-fluid rounded-start" style={{height: "100%", objectFit: "cover"}} alt="Chinese Restaurant" />
                  </div>
                  <div className="col-8">
                    <div className="card-body py-2">
                      <h6 className="card-title fw-bold mb-1">Golden Dragon</h6>
                      <p className="card-text mb-1"><small>🥡 Chinese, Asian</small></p>
                      <p className="mb-0"><small className="text-danger">4.5 ★ • 25-40 min</small></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination */}
          <nav className="mt-5">
            <ul className="pagination justify-content-center">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Restaurants; 