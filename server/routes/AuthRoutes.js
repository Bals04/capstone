const express = require("express");
const router = express.Router();
const path = require('path');
const AuthController = require('../controllers/authController');
const { createTokens, validateToken } = require('../middlewares/JWT')
const validation = require('../middlewares/validation')
const userSchema = require('../validations/userValidations')
const gymAdminSchema = require('../validations/gymAdminValidations')

router.post("/Register", validation(userSchema), AuthController.Register);
router.post("/RegisterAdmin",validation(gymAdminSchema), AuthController.createGymAdmin);
router.post("/RegisterMember", AuthController.createMembers);
router.post("/Login", AuthController.Login);
// Express route to get session data
router.get('/session-data', (req, res) => {
    // Log session data for debugging
    console.log('Session data:', req.session);

    if (req.session.authorized) {
        res.json({
            userType: req.session.userType,
            authorized: req.session.authorized,
            accessToken: req.session.accessToken
        });
    } else {
        res.json({
            userType: null,
            authorized: false,
            accessToken: null
        });
    }
});




module.exports = router;

