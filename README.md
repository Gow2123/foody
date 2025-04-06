# 🍔 Foody - Food Delivery Platform

A comprehensive food delivery platform with customer-facing frontend, restaurant admin panel, and backend API.

## 🌟 Features

### 👨‍💻 Customer Frontend
- **User Authentication** - Register, login, and profile management
- **Restaurant Browsing** - View available restaurants with search and filters
- **Menu Exploration** - Browse restaurant menus with detailed food descriptions
- **Shopping Cart** - Add items, customize quantities, and checkout
- **Order History** - View past and current orders with status tracking
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### 🍕 Restaurant Admin Panel
- **Vendor Authentication** - Secure login for restaurant owners
- **Restaurant Profile Management** - Update restaurant details and images
- **Menu Management** - Add, edit, and delete menu items
- **Order Processing** - View incoming orders and update status
- **Sales Analytics** - View sales data and performance metrics

### ⚙️ Backend API
- **RESTful API** - Well-structured endpoints for all functionality
- **User Management** - Authentication and profile handling
- **Order Processing** - Order creation, updates, and history
- **Restaurant Management** - Restaurant data and menu management
- **MongoDB Integration** - Persistent data storage

## 📋 Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- CSS for styling

### Admin Panel
- React.js
- Vite for development
- Custom styling with CSS variables

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git

### Installation & Setup

#### Clone the Repository
```bash
git clone https://github.com/Gow2123/foody-app.git
cd foody-app
```

#### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file with:
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:
```bash
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at http://localhost:5173

#### Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```
The admin panel will be available at http://localhost:5174

## 📱 Usage Instructions

### Customer App
1. Register or log in to your account
2. Browse restaurants or search for specific cuisine
3. Select a restaurant to view their menu
4. Add items to your cart
5. Proceed to checkout and complete your order
6. Track your order status in real-time

### Restaurant Admin
1. Log in to the admin panel
2. Set up your restaurant profile (for new vendors)
3. Manage your menu items
4. Process incoming orders
5. View your sales analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or suggestions, please reach out to:
- GitHub: [@Gow2123](https://github.com/Gow2123) 