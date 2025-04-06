const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    console.log('User test route accessed');
    res.status(200).json({ 
        success: true,
        message: "User API is working!",
        time: new Date().toISOString()
    });
});

// Authentication routes
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);

// User profile routes
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUserProfile);

module.exports = router; 