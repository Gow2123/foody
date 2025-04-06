const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.WhatIsYourName



const vendorRegister = async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();

        res.status(201).json({ message: "Vendor registered successfully" });
        console.log('registered')

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }

}

const vendorLogin = async(req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);
    
    try {
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ error: "Email and password are required" });
        }
        
        const vendor = await Vendor.findOne({ email });
        console.log("Vendor found:", vendor ? "Yes" : "No");
        
        if (!vendor) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        const passwordMatch = await bcrypt.compare(password, vendor.password);
        console.log("Password match:", passwordMatch ? "Yes" : "No");
        
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        console.log("Secret key exists:", secretKey ? "Yes" : "No");
        if (!secretKey) {
            console.error("JWT secret key is missing");
            return res.status(500).json({ error: "Server configuration error" });
        }
        
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" });
        const vendorId = vendor._id;

        console.log("Login successful for:", email);
        res.status(200).json({ success: "Login successful", token, vendorId });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

const getAllVendors = async(req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const getVendorById = async(req, res) => {
    const vendorId = req.params.apple;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        
        let vendorFirmId = null;
        let vendorFirmName = null;
        
        // Check if vendor has any firms before accessing the first one
        if (vendor.firm && vendor.firm.length > 0) {
            vendorFirmId = vendor.firm[0]._id;
            vendorFirmName = vendor.firm[0].firmName;
            console.log("Vendor firm found:", vendorFirmId);
        } else {
            console.log("Vendor has no firms yet");
        }
        
        res.status(200).json({ 
            vendorId, 
            vendorFirmId, 
            vendor,
            hasFirm: vendor.firm && vendor.firm.length > 0
        });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}


module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById }