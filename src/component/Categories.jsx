// Categories component showing food categories

function Categories() {
  return (
    <div className="container mt-3 pt-2">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-danger fw-bold mb-4">Food Categories</h2>
          
          {/* Category cards row */}
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3 mb-5">
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Pizza" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Pizza</h6>
                  <span className="badge bg-secondary">42 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Burgers" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Burgers</h6>
                  <span className="badge bg-secondary">38 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1632&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Sushi" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Sushi</h6>
                  <span className="badge bg-secondary">29 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1381&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Pizza" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Italian</h6>
                  <span className="badge bg-secondary">56 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1551326844-4df70f78d0e9?q=80&w=1376&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Mexican" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Mexican</h6>
                  <span className="badge bg-secondary">32 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1364&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Desserts" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Desserts</h6>
                  <span className="badge bg-secondary">27 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1325&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Indian" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Indian</h6>
                  <span className="badge bg-secondary">22 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1332&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Vegetarian" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Vegetarian</h6>
                  <span className="badge bg-secondary">19 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Chicken" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Chicken</h6>
                  <span className="badge bg-secondary">45 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1374&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Chinese" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Chinese</h6>
                  <span className="badge bg-secondary">36 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1473&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Breakfast" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Breakfast</h6>
                  <span className="badge bg-secondary">28 restaurants</span>
                </div>
              </div>
            </div>
            
            <div className="col">
              <div className="card h-100 shadow-sm border-0 text-center">
                <img src="https://images.unsplash.com/photo-1597289124948-688c1a35cb48?q=80&w=1364&auto=format&fit=crop" className="card-img-top" style={{height: "120px", objectFit: "cover"}} alt="Coffee" />
                <div className="card-body">
                  <h6 className="card-title fw-bold">Coffee</h6>
                  <span className="badge bg-secondary">24 restaurants</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured category section - Pizza */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-danger fw-bold">Pizza Places</h3>
              <button className="btn btn-outline-danger">View All</button>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1470&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Pizza Restaurant" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Pizza Heaven</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.8 ★</span>
                      <span className="badge bg-light text-dark border">30-45 min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1335&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Pizza Restaurant" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Bella Napoli</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.7 ★</span>
                      <span className="badge bg-light text-dark border">35-50 min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1571066811602-716837d681de?q=80&w=1344&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Pizza Restaurant" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Pizza Palace</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.6 ★</span>
                      <span className="badge bg-light text-dark border">20-35 min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?q=80&w=1374&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Pizza Restaurant" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Slice of Heaven</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.5 ★</span>
                      <span className="badge bg-light text-dark border">25-40 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured category section - Burgers */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-danger fw-bold">Burger Joints</h3>
              <button className="btn btn-outline-danger">View All</button>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1471&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Burger Joint" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Burger Blast</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.6 ★</span>
                      <span className="badge bg-light text-dark border">20-35 min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1415&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Burger Joint" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Patty Paradise</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.7 ★</span>
                      <span className="badge bg-light text-dark border">25-40 min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?q=80&w=1280&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Burger Joint" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Gourmet Grill</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.8 ★</span>
                      <span className="badge bg-light text-dark border">30-45 min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <img src="https://images.unsplash.com/photo-1596662951482-0c4ba27a4c25?q=80&w=1287&auto=format&fit=crop" className="card-img-top" style={{height: "160px", objectFit: "cover"}} alt="Burger Joint" />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Burger Boulevard</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-success">4.5 ★</span>
                      <span className="badge bg-light text-dark border">15-30 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories; 