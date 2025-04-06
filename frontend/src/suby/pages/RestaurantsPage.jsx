import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RestaurantsPage.css';

// Placeholder image for fallback
const placeholderImage = 'https://img.icons8.com/fluency/96/restaurant.png';

// Restaurant sample data with web images
const sampleRestaurants = [
  {
    id: 1,
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1584030239764-5a5ed6b0628c?q=80&w=1470&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 254,
    categories: ['Burgers', 'American', 'Fast Food'],
    deliveryTime: '15-25 min',
    deliveryFee: '$2.99',
    featured: true
  },
  {
    id: 2,
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1374&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 186,
    categories: ['Pizza', 'Italian', 'Pasta'],
    deliveryTime: '20-30 min',
    deliveryFee: '$3.49',
    featured: true
  },
  {
    id: 3,
    name: 'Sushi World',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1332&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 312,
    categories: ['Japanese', 'Sushi', 'Asian'],
    deliveryTime: '25-35 min',
    deliveryFee: '$4.99',
    featured: true
  },
  {
    id: 4,
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1080&auto=format&fit=crop',
    rating: 4.3,
    reviewCount: 145,
    categories: ['Mexican', 'Tacos', 'Latin'],
    deliveryTime: '15-25 min',
    deliveryFee: '$2.49',
    featured: false
  },
  {
    id: 5,
    name: 'Healthy Greens',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop',
    rating: 4.2,
    reviewCount: 98,
    categories: ['Salads', 'Healthy', 'Vegan'],
    deliveryTime: '15-20 min',
    deliveryFee: '$1.99',
    featured: false
  },
  {
    id: 6,
    name: 'Curry House',
    image: 'https://images.unsplash.com/photo-1534339480783-6816b68be04c?q=80&w=1374&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 210,
    categories: ['Indian', 'Asian', 'Curry'],
    deliveryTime: '25-40 min',
    deliveryFee: '$3.99',
    featured: false
  }
];

// Categories for filtering
const categories = [
  'All', 'Burgers', 'Pizza', 'Sushi', 'Mexican', 'Italian', 
  'Asian', 'Vegetarian', 'Fast Food', 'Healthy'
];

const RestaurantsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter restaurants based on search term and category
  const filteredRestaurants = sampleRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.categories.some(category => category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || 
      restaurant.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'featured') {
      return b.featured - a.featured;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'deliveryTime') {
      return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    }
    return 0;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="restaurants-container page-content">
      <div className="restaurants-header">
        <h1>Restaurants</h1>
        <p>Discover the best food for delivery near you</p>
      </div>

      <div className="restaurants-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="sort-container">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort" 
            value={sortBy} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="featured">Featured</option>
            <option value="rating">Rating</option>
            <option value="deliveryTime">Delivery Time</option>
          </select>
        </div>
      </div>

      <div className="categories-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="restaurants-grid">
        {sortedRestaurants.length > 0 ? (
          sortedRestaurants.map(restaurant => (
            <div key={restaurant.id} className="restaurant-card">
              <div className="restaurant-image">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  onError={(e) => {e.target.src = placeholderImage; e.target.classList.add('fallback-image');}}
                />
                {restaurant.featured && <span className="featured-tag">Featured</span>}
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <div className="restaurant-rating">
                  <span className="rating-star">★</span>
                  <span className="rating-value">{restaurant.rating}</span>
                  <span className="rating-count">({restaurant.reviewCount})</span>
                </div>
                <div className="restaurant-categories">
                  {restaurant.categories.join(' • ')}
                </div>
                <div className="restaurant-details">
                  <span className="delivery-time">{restaurant.deliveryTime}</span>
                  <span className="delivery-fee">{restaurant.deliveryFee} delivery</span>
                </div>
                <Link to={`/restaurant/${restaurant.id}`} className="view-menu-button">
                  View Menu
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🍽️</div>
            <h3>No restaurants found</h3>
            <p>Try changing your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage; 