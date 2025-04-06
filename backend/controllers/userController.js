const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.WhatIsYourName || 'userSecretKey123';

const userRegister = async(req, res) => {
    console.log('Registration attempt with data:', { 
        username: req.body.username, 
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address 
    });
    
    const { username, email, password, phone, address } = req.body;
    try {
        // Check if user with this email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            console.log('Registration failed: Email already registered:', email);
            return res.status(400).json({ 
                success: false,
                message: "Email already registered" 
            });
        }
        
        // Check if username is already taken
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            console.log('Registration failed: Username already taken:', username);
            return res.status(400).json({ 
                success: false,
                message: "Username already taken" 
            });
        }
        
        console.log('Creating new user:', username);
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            address
        });
        
        // Save user to database
        await newUser.save();
        console.log('User registered successfully:', username);

        res.status(201).json({ 
            success: true,
            message: "User registered successfully" 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: "Registration failed. Please try again." 
        });
    }
};

const userLogin = async(req, res) => {
    console.log('Login attempt with data:', req.body);
    const { username, password } = req.body;
    
    try {
        // Find user by username or email
        const user = await User.findOne({ 
            $or: [
                { username: username },
                { email: username }
            ]
        });
        
        // Check if user exists
        if (!user) {
            console.log('User not found for login:', username);
            return res.status(401).json({ 
                success: false,
                message: "Invalid username or password" 
            });
        }
        
        console.log('User found, checking password');
        
        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ 
                success: false,
                message: "Invalid username or password" 
            });
        }
        
        console.log('Password valid, generating token');
        
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "24h" });
        
        console.log('Login successful for user:', username);
        
        res.status(200).json({ 
            success: true,
            message: "Login successful", 
            token, 
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error"
        });
    }
};

const getUserById = async(req, res) => {
    const userId = req.params.userId;
    console.log('Fetching user by ID:', userId);
    
    try {
        const user = await User.findById(userId)
            .select('-password') // Exclude password from the response
            .populate('favorites')
            .populate('orders');
            
        if (!user) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }
        
        console.log('User found:', user.username);
        res.status(200).json({ 
            success: true,
            user 
        });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

const updateUserProfile = async(req, res) => {
    const userId = req.params.userId;
    const { username, email, phone, address } = req.body;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, phone, address },
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { 
    userRegister, 
    userLogin, 
    getUserById,
    updateUserProfile
}; 