// Food cards using Bootstrap card templates

function FoodCards() {
  return (
    <div className="container mt-3 pt-2">
      <h2 className="mb-3 text-danger fw-bold">Popular Restaurants</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card h-100 shadow border-0">
            <img src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "200px", objectFit: "cover"}} alt="Pizza Restaurant" />
            <div className="card-body">
              <h5 className="card-title fw-bold">Pizza Heaven</h5>
              <p className="card-text">Authentic Italian pizzas made in wood-fired ovens with the freshest ingredients.</p>
            </div>
            <div className="card-footer bg-white border-0">
              <small className="text-danger fw-bold">4.8 ★ • 30-45 min delivery</small>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow border-0">
            <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1471&auto=format&fit=crop" className="card-img-top" style={{height: "200px", objectFit: "cover"}} alt="Burger Restaurant" />
            <div className="card-body">
              <h5 className="card-title fw-bold">Burger Blast</h5>
              <p className="card-text">Juicy, mouthwatering burgers with a variety of toppings and sides.</p>
            </div>
            <div className="card-footer bg-white border-0">
              <small className="text-danger fw-bold">4.6 ★ • 20-35 min delivery</small>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100 shadow border-0">
            <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "200px", objectFit: "cover"}} alt="Sushi Restaurant" />
            <div className="card-body">
              <h5 className="card-title fw-bold">Sushi Palace</h5>
              <p className="card-text">Fresh and delicious sushi prepared by expert chefs using premium ingredients.</p>
            </div>
            <div className="card-footer bg-white border-0">
              <small className="text-danger fw-bold">4.9 ★ • 40-55 min delivery</small>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-4 text-danger fw-bold">Featured Deals</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card shadow border-0">
            <div className="row g-0">
              <div className="col-md-4">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1374&auto=format&fit=crop" className="img-fluid rounded-start" style={{height: "100%", objectFit: "cover"}} alt="Family Deal" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title fw-bold">Family Weekend Special</h5>
                  <p className="card-text">Get 20% off on family-sized meals every weekend. Perfect for gatherings!</p>
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
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1381&auto=format&fit=crop" className="img-fluid rounded-start" style={{height: "100%", objectFit: "cover"}} alt="Lunch Deal" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title fw-bold">Weekday Lunch Offer</h5>
                  <p className="card-text">30% off on all lunch orders between 11 AM and 2 PM, Monday to Friday.</p>
                  <a href="#" className="btn btn-danger">Order Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-3 mt-4 text-danger fw-bold">Popular Cuisine Categories</h2>
      <div className="row row-cols-2 row-cols-md-4 g-3">
        <div className="col">
          <div className="card text-center h-100 shadow border-0">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "150px", objectFit: "cover"}} alt="Pizza" />
            <div className="card-body">
              <h5 className="card-title fw-bold">Pizza</h5>
              <a href="#" className="btn btn-outline-danger">Browse</a>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100 shadow border-0">
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop" className="card-img-top" style={{height: "150px", objectFit: "cover"}} alt="Burgers" />
            <div className="card-body">
              <h5 className="card-title fw-bold">Burgers</h5>
              <a href="#" className="btn btn-outline-danger">Browse</a>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100 shadow border-0">
            <img src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1632&auto=format&fit=crop" className="card-img-top" style={{height: "150px", objectFit: "cover"}} alt="Sushi" />
            <div className="card-body">
              <h5 className="card-title fw-bold">Sushi</h5>
              <a href="#" className="btn btn-outline-danger">Browse</a>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center h-100 shadow border-0">
            <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1364&auto=format&fit=crop" className="card-img-top" style={{height: "150px", objectFit: "cover"}} alt="Desserts" />
            <div className="card-body">
              <h5 className="card-title fw-bold">Desserts</h5>
              <a href="#" className="btn btn-outline-danger">Browse</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCards; 