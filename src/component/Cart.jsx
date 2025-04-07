import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, removeFromCart, updateQuantity }) {
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 1) {
      updateQuantity(productId, quantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>Your Cart is Empty</h2>
        <p>Add some delicious items to get started!</p>
        <button className="btn btn-success" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Shopping Cart</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item._id}>
                <td>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop";
                      e.target.onerror = null;
                    }}
                  />
                </td>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    min="1"
                    style={{ width: '60px' }}
                  />
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <i className="bi bi-trash"></i> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 d-flex justify-content-end align-items-center">
        <h4 className="me-4">Total: <span className="text-success fw-bold">${totalAmount.toFixed(2)}</span></h4>
        <button className="btn btn-success btn-lg" onClick={() => alert('Checkout functionality to be implemented!')}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

Cart.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
};

export default Cart; 