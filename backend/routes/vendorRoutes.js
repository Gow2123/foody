const vendorController = require('../controllers/vendorController');
const express = require('express');

const router = express.Router();

// Add a test endpoint
router.get('/test', (req, res) => {
    res.status(200).json({ message: "Vendor API is working!" });
});

router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);

router.get('/all-vendors', vendorController.getAllVendors);
router.get('/single-vendor/:apple', vendorController.getVendorById)

module.exports = router;