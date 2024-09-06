const express = require("express");
const router = express.Router();
const path = require('path');
const AuthController = require('../controllers/authController');
const { createTokens, validateToken } = require('../middlewares/JWT')
    

router.post("/Register", AuthController.Register); 
router.post("/RegisterAdmin", AuthController.createGymAdmin); 
router.post("/Login", AuthController.Login); 
router.get("/Profile", validateToken, AuthController.ShowDetails); 
router.get("/validate-token", validateToken, (req, res) => {
    // If validateToken middleware succeeds, the request reaches here
    res.status(200).json({ valid: true });
});


module.exports = router;

