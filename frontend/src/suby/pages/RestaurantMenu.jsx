import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './RestaurantMenu.css';

// Sample menu item data (will be replaced with API fetch in production)
const sampleMenuCategories = [
  { id: 1, name: 'Starters', slug: 'starters' },
  { id: 2, name: 'Main Courses', slug: 'main-courses' },
  { id: 3, name: 'Burgers', slug: 'burgers' },
  { id: 4, name: 'Pizzas', slug: 'pizzas' },
  { id: 5, name: 'Sides', slug: 'sides' },
  { id: 6, name: 'Desserts', slug: 'desserts' },
  { id: 7, name: 'Drinks', slug: 'drinks' }
];

const sampleMenuItems = {
  starters: [
    { id: 101, name: 'Crispy Calamari Rings', description: 'Lightly battered calamari served with tartar sauce and a lemon wedge', price: 8.99, image: 'https://images.unsplash.com/photo-1533007473171-2456c925d8f4?q=80&w=1450&auto=format&fit=crop' },
    { id: 102, name: 'Mozzarella Sticks', description: 'Golden fried cheese sticks with marinara dipping sauce', price: 6.99, image: 'https://images.unsplash.com/photo-1548340748-6d2b7c7a7d22?q=80&w=1374&auto=format&fit=crop' },
    { id: 103, name: 'Spinach & Artichoke Dip', description: 'Creamy blend of spinach, artichokes, and cheeses served with tortilla chips', price: 9.99, image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?q=80&w=1335&auto=format&fit=crop' }
  ],
  'main-courses': [
    { id: 201, name: 'Grilled Salmon', description: 'Fresh Atlantic salmon fillet with lemon butter sauce and seasonal vegetables', price: 18.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1470&auto=format&fit=crop' },
    { id: 202, name: 'Chicken Alfredo', description: 'Fettuccine pasta with creamy alfredo sauce and grilled chicken breast', price: 15.99, image: 'https://images.unsplash.com/photo-1673208688399-3c9bc283918b?q=80&w=1470&auto=format&fit=crop' },
    { id: 203, name: 'Beef Tenderloin', description: '8oz prime cut beef tenderloin with garlic mashed potatoes and grilled asparagus', price: 24.99, image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1331&auto=format&fit=crop' }
  ],
  burgers: [
    { id: 301, name: 'Classic Cheeseburger', description: 'Angus beef patty with American cheese, lettuce, tomato, and special sauce', price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1398&auto=format&fit=crop' },
    { id: 302, name: 'Mushroom Swiss Burger', description: 'Angus beef patty topped with sautéed mushrooms and Swiss cheese', price: 14.99, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1415&auto=format&fit=crop' },
    { id: 303, name: 'Veggie Burger', description: 'House-made vegetable and bean patty with avocado, sprouts, and vegan aioli', price: 13.99, image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=1364&auto=format&fit=crop' }
  ],
  pizzas: [
    { id: 401, name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil', price: 14.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop' },
    { id: 402, name: 'Pepperoni Pizza', description: 'Traditional pizza with tomato sauce, mozzarella, and crispy pepperoni', price: 15.99, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=1476&auto=format&fit=crop' },
    { id: 403, name: 'Vegetarian Supreme', description: 'Pizza loaded with bell peppers, mushrooms, olives, onions, and tomatoes', price: 16.99, image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?q=80&w=1374&auto=format&fit=crop' }
  ],
  sides: [
    { id: 501, name: 'French Fries', description: 'Crispy golden fries seasoned with sea salt', price: 4.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1374&auto=format&fit=crop' },
    { id: 502, name: 'Onion Rings', description: 'Beer-battered onion rings with spicy dipping sauce', price: 5.99, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=1374&auto=format&fit=crop' },
    { id: 503, name: 'Garden Salad', description: 'Fresh mixed greens with cherry tomatoes, cucumbers, and house dressing', price: 6.99, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=1378&auto=format&fit=crop' }
  ],
  desserts: [
    { id: 601, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla ice cream', price: 7.99, image: 'https://images.unsplash.com/photo-1617303673740-3cfa152cefc9?q=80&w=1374&auto=format&fit=crop' },
    { id: 602, name: 'New York Cheesecake', description: 'Creamy cheesecake with graham cracker crust and berry compote', price: 8.99, image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=1471&auto=format&fit=crop' },
    { id: 603, name: 'Apple Pie', description: 'Homemade apple pie with cinnamon and caramel sauce', price: 6.99, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=1470&auto=format&fit=crop' }
  ],
  drinks: [
    { id: 701, name: 'Fresh Lemonade', description: 'Freshly squeezed lemon juice with a hint of mint', price: 3.99, image: 'https://images.unsplash.com/photo-1556679343-c1c1c9c110b0?q=80&w=1364&auto=format&fit=crop' },
    { id: 702, name: 'Iced Tea', description: 'House-brewed tea with optional lemon and sweetener', price: 2.99, image: 'https://images.unsplash.com/photo-1556679343-c1c1c9c110b0?q=80&w=1364&auto=format&fit=crop' },
    { id: 703, name: 'Craft Beer Selection', description: 'Ask your server about our rotating selection of craft beers', price: 6.99, image: 'https://images.unsplash.com/photo-1613766341404-3a67a531901f?q=80&w=1374&auto=format&fit=crop' }
  ]
};

const sampleRestaurants = {
  1: {
    id: 1,
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1584030239764-5a5ed6b0628c?q=80&w=1470&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 254,
    description: 'Burger Palace is a premium burger joint offering gourmet burgers made with 100% Angus beef. Our menu features classic favorites and innovative signature creations that will satisfy any burger enthusiast.',
    categories: ['Burgers', 'American', 'Fast Food'],
    address: '123 Burger Ave, Foodville, CA 94123',
    hours: 'Mon-Sun: 11am-10pm',
    phoneNumber: '(555) 123-4567',
    deliveryTime: '15-25 min',
    deliveryFee: '$2.99',
    minimumOrder: '$15.00',
    featured: true
  }
};

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('starters');
  const [cart, setCart] = useState([]);
  
  // Get restaurant data
  useEffect(() => {
    // In production, this would be a fetch call to your API
    // For demo purposes, we're using sample data
    setTimeout(() => {
      setRestaurant(sampleRestaurants[id] || sampleRestaurants[1]);
      setLoading(false);
    }, 500);
  }, [id]);
  
  // Function to handle adding items to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item is already in cart
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Increase quantity if item exists
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };
  
  const scrollToCategory = (categorySlug) => {
    setActiveCategory(categorySlug);
    const element = document.getElementById(categorySlug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Restaurant Not Found</h2>
        <p>We couldn't find the restaurant you're looking for.</p>
        <Link to="/restaurants" className="btn-primary">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="restaurant-menu-page page-content">
      <div className="restaurant-hero">
        <div className="hero-image-container">
          <img src={restaurant.image} alt={restaurant.name} className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content container">
          <div className="restaurant-branding">
            <h1>{restaurant.name}</h1>
            <div className="restaurant-tags">
              {restaurant.categories.map((category, index) => (
                <span key={index} className="restaurant-tag">{category}</span>
              ))}
            </div>
            <div className="restaurant-meta">
              <div className="restaurant-rating">
                <span className="rating-star">★</span>
                <span className="rating-text">{restaurant.rating} ({restaurant.reviewCount} reviews)</span>
              </div>
              <div className="restaurant-delivery">
                <span className="delivery-time">{restaurant.deliveryTime}</span>
                <span className="delivery-fee">{restaurant.deliveryFee} delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="restaurant-details-bar">
        <div className="container">
          <div className="restaurant-info-pills">
            <div className="info-pill">
              <span className="info-icon">📍</span>
              <span className="info-text">{restaurant.address}</span>
            </div>
            <div className="info-pill">
              <span className="info-icon">🕒</span>
              <span className="info-text">{restaurant.hours}</span>
            </div>
            <div className="info-pill">
              <span className="info-icon">📞</span>
              <span className="info-text">{restaurant.phoneNumber}</span>
            </div>
            <div className="info-pill">
              <span className="info-icon">💰</span>
              <span className="info-text">Min. {restaurant.minimumOrder}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="menu-container container">
        <div className="menu-sidebar">
          <div className="category-navigation">
            <h3>Menu</h3>
            <ul className="category-list">
              {sampleMenuCategories.map(category => (
                <li 
                  key={category.id} 
                  className={`category-item ${activeCategory === category.slug ? 'active' : ''}`}
                  onClick={() => scrollToCategory(category.slug)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="cart-preview">
            <h3>Your Order</h3>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <p className="empty-cart-subtitle">Add items to get started</p>
              </div>
            ) : (
              <>
                <ul className="cart-items">
                  {cart.map(item => (
                    <li key={item.id} className="cart-item">
                      <div className="cart-item-quantity">{item.quantity}x</div>
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="cart-summary">
                  <div className="cart-total-row">
                    <span>Subtotal</span>
                    <span>${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="cart-total-row">
                    <span>Delivery Fee</span>
                    <span>{restaurant.deliveryFee}</span>
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <span>${(cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 2.99).toFixed(2)}</span>
                  </div>
                </div>
                <button className="checkout-button">
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="menu-content">
          <div className="restaurant-description">
            <h2>About {restaurant.name}</h2>
            <p>{restaurant.description}</p>
          </div>
          
          {sampleMenuCategories.map(category => (
            <div key={category.id} id={category.slug} className="menu-section">
              <h2 className="menu-section-title">{category.name}</h2>
              <div className="menu-items">
                {sampleMenuItems[category.slug].map(item => (
                  <div key={item.id} className="menu-item">
                    <div className="menu-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-info">
                        <h3 className="menu-item-name">{item.name}</h3>
                        <p className="menu-item-description">{item.description}</p>
                      </div>
                      <div className="menu-item-action">
                        <div className="menu-item-price">${item.price.toFixed(2)}</div>
                        <button className="add-to-cart-button" onClick={() => addToCart(item)}>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu; 