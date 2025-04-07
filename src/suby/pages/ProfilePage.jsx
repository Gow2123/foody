import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Here you would make an API call to update user details
    try {
      // Simulate API call
      setTimeout(() => {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }, 1000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.username?.charAt(0) || 'U'}
        </div>
        <div className="profile-intro">
          <h1>My Profile</h1>
          <p>Manage your account information and settings</p>
        </div>
      </div>

      {success && (
        <div className="profile-alert success">
          <span className="profile-alert-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="profile-alert error">
          <span className="profile-alert-icon">!</span>
          <span>{error}</span>
        </div>
      )}

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Personal Information</h2>
          {!isEditing && (
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="profile-info">{user?.username || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="profile-info">{user?.email || 'Not provided'}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <div className="profile-info">{user?.phone || 'Not provided'}</div>
              )}
            </div>

            <div className="form-group">
              <label>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              ) : (
                <div className="profile-info">{user?.address || 'Not provided'}</div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Order History</h2>
        </div>
        <div className="order-history">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No orders yet</h3>
            <p>When you place orders, they will appear here</p>
            <button className="btn btn-primary">Browse Restaurants</button>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Favorite Restaurants</h2>
        </div>
        <div className="favorites">
          <div className="empty-state">
            <div className="empty-icon">❤️</div>
            <h3>No favorites yet</h3>
            <p>Save your favorite restaurants for quick access</p>
            <button className="btn btn-primary">Explore Restaurants</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 