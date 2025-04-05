# Foody - Customer Frontend

This repository contains the customer-facing frontend for the Foody application, a modern, responsive food delivery platform built with React.

**Live Deployment:** [foody-mern.vercel.app](https://foody-mern.vercel.app/)

**Related Repositories:**
*   Backend API Server: [Gow2123/foody-backend](https://github.com/Gow2123/foody-backend)
*   Admin Frontend: [Gow2123/foody-admin](https://github.com/Gow2123/foody-admin)

## 🍕 Features

*   **User Authentication**: Login and signup pages.
*   **Restaurant & Product Browsing**: View restaurants, categories, and individual products.
*   **Shopping Cart**: Add/remove items, update quantities.
*   **Order History**: View past orders (requires login).
*   **Responsive Design**: Adapts to different screen sizes (mobile, tablet, desktop).

## 🚀 Tech Stack

*   React
*   Vite
*   React Router DOM
*   Bootstrap 5
*   CSS3 / Custom Styling
*   Socket.IO Client (for potential real-time features, though primary use might be in admin)

## 📋 Prerequisites

*   Node.js (v14.0.0 or later recommended)
*   npm (v6.0.0 or later) or yarn
*   Git

## 🔧 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Gow2123/foody.git
    cd foody
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Ensure the Backend is Running:** This frontend requires the `foody-backend` server to be running to fetch data and handle authentication. Please refer to the [foody-backend README](https://github.com/Gow2123/foody-backend) for setup instructions. By default, the frontend expects the backend to be available at `http://localhost:3000`.

## ▶️ Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```

2.  **Open your browser:** Navigate to `http://localhost:5173` (or the port specified in the terminal output).

## 🖥️ Application Structure (Key Areas)

```
foody/
├── public/          # Static assets
├── src/             # Source files
│   ├── assets/      # Image assets
│   ├── component/   # Reusable React components (Navbar, Footer, Cart, Products, etc.)
│   ├── pages/       # Page-level components (potentially simple wrappers)
│   ├── App.jsx      # Main application component with routing
│   ├── App.css      # Global and component-specific styles
│   ├── index.css    # Base styles and CSS variables
│   └── main.jsx     # Application entry point
├── .gitignore       # Files ignored by Git
├── index.html       # HTML entry point
├── package.json     # Project metadata and dependencies
└── vite.config.js   # Vite configuration
```

## 🙏 Acknowledgements

*   Unsplash - For high-quality food images
*   Bootstrap - For responsive design components
*   React - For the UI library
*   Vite - For the build tool and dev server