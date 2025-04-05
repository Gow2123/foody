import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; // Import socket.io-client
// Import BACKEND_URL from the shared config file
import BACKEND_URL from '../config';

// Use the imported BACKEND_URL
const socket = io(BACKEND_URL);

// Allowed category values from the backend model
const allowedCategories = ['pizza', 'burgers', 'sushi', 'desserts', 'drinks', 'mexican', 'indian', 'thai', 'italian', 'chinese', 'middle_eastern', 'coffee'];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: allowedCategories[0], // Default to the first allowed category
    image: '',
    restaurant: '', // Assuming restaurant name is sufficient for now
    deliveryTime: '', // Add deliveryTime state
    // rating: '0',     // Add if needed
    type: 'product' // Explicitly set type for clarity
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        // Filter products to show only type 'product' in admin panel if desired
        setProducts(data.filter(p => !p.type || p.type === 'product'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Socket.io listeners
    socket.on('product_added', (addedProduct) => {
      // Only add if it's a product type
      if (!addedProduct.type || addedProduct.type === 'product') {
         setProducts((prevProducts) => [...prevProducts, addedProduct]);
      }
    });

    socket.on('product_deleted', (deletedProductId) => {
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== deletedProductId));
    });

    // Cleanup on component unmount
    return () => {
      socket.off('product_added');
      socket.off('product_deleted');
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      // Basic frontend validation (optional but good practice)
      if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image || !newProduct.category || !newProduct.restaurant || !newProduct.deliveryTime) {
        setError("Please fill in all required fields.");
        return;
      }

      const productData = { 
        ...newProduct, 
        price: parseFloat(newProduct.price),
        // Ensure deliveryTime is included
        // rating: parseFloat(newProduct.rating) 
      };

      const response = await fetch(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if your POST /products route requires auth
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData) // Send validated data
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({})); // Try to get error details
         throw new Error(errorData.message || `Failed to add product (Status: ${response.status})`);
      }
      
      // Clear form (state update handled by socket event)
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: allowedCategories[0], 
        image: '',
        restaurant: '',
        deliveryTime: '', // Reset deliveryTime
        type: 'product'
      });
    } catch (err) {
      setError(err.message);
      console.error("Add product error:", err);
    }
  };

  const handleDelete = async (id) => {
     setError(''); // Clear previous errors
    try {
      const response = await fetch(`${BACKEND_URL}/products/${id}`, {
        method: 'DELETE',
         // Add Authorization header if your DELETE /products route requires auth
         // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to get error details
          throw new Error(errorData.message || `Failed to delete product (Status: ${response.status})`);
      }
      // State update handled by socket event
    } catch (err) {
      setError(err.message);
      console.error("Delete product error:", err);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>

      {/* Display Error Message */}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Add Product Form */}
      <div className="card mb-4 border-success">
        <div className="card-header bg-success text-white">Add New Product</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  step="0.01" // Allow decimal prices
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                >
                  {allowedCategories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Restaurant Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="restaurant"
                  value={newProduct.restaurant}
                  onChange={handleInputChange}
                  required
                  // Consider changing to a dropdown fetched from existing restaurants later
                />
              </div>
            </div>
            {/* Add Delivery Time Input */}
            <div className="row">
               <div className="col-md-6 mb-3">
                 <label className="form-label">Delivery Time (e.g., &apos;20-30 min&apos;)</label>
                 <input
                   type="text"
                   className="form-control"
                   name="deliveryTime"
                   value={newProduct.deliveryTime}
                   onChange={handleInputChange}
                   required // Make it required as per backend model
                 />
               </div>
               {/* Optional Rating Input (if needed) */}
               {/* <div class="col-md-6 mb-3">
                  <label class="form-label">Rating (0-5)</label>
                  <input type="number" class="form-control" name="rating" value={newProduct.rating} onChange={handleInputChange} step="0.1" min="0" max="5" />
               </div> */}
             </div>
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="url" // Use type="url" for better validation
                className="form-control"
                name="image"
                value={newProduct.image}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              <i className="bi bi-plus-circle me-2"></i>Add Product
            </button>
          </form>
        </div>
      </div>

      {/* Products List */}
      <h4 className="mt-5 mb-3">Existing Products</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Restaurant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                      e.target.onerror = null;
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>${product.price ? product.price.toFixed(2) : 'N/A'}</td>
                <td>{product.category}</td>
                <td>{product.restaurant}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product._id)}
                    title="Delete Product"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  {/* Add Edit button later if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts; 