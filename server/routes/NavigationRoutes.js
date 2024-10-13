const express = require('express');
const path = require('path');
const { validateToken } = require('../middlewares/JWT');  // Import the validateToken middleware
const router = express.Router();

// Navigation routes

// Route for the member dashboard (protected)
router.get('/members', validateToken, (req, res) => {
    // Only members should be able to access this route
    if (req.userType === 'Member') {
        res.sendFile(path.join(__dirname, '../../frontend/views/member/index.html'));  // Adjust the path to the frontend folder
    } else {
        res.redirect('/homepage');  // Redirect to homepage if not a Member
    }
});

// Route for the trainer dashboard (protected)
router.get('/trainers', validateToken, (req, res) => {
    // Only trainers should be able to access this route
    if (req.userType === 'Trainer') {
        res.sendFile(path.join(__dirname, '../../frontend/views/trainer/index.html'));  // Adjust the path accordingly
    } else {
        res.redirect('/homepage');  // Redirect to homepage if not a Trainer
    }
});

// Route for the admin dashboard (protected)
router.get('/admin', validateToken, (req, res) => {
    // Only admins should be able to access this route
    if (req.userType === 'Admin') {
        res.sendFile(path.join(__dirname, '../../frontend/views/admin/adminDashboard.html'));  // Adjust the path accordingly
    } else {
        res.redirect('/homepage');  // Redirect to homepage if not an Admin
    }
});

// Route for the gym admin dashboard (protected)
router.get('/gymadmin', validateToken, (req, res) => {
    // Only gym admins should be able to access this route
    if (req.userType === 'GymAdmin') {
        res.sendFile(path.join(__dirname, '../../frontend/views/features/calendar.html'));  // Adjust the path accordingly
    } else {
        res.redirect('/homepage');  // Redirect to homepage if not a GymAdmin
    }
});

// Public route (example)
router.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/Landing Page/index.html'));  // Public page, no validation needed
});

module.exports = router;
