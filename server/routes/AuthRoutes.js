const express = require("express");
const router = express.Router();
const path = require('path');
const AuthController = require('../controllers/authController');
const { createTokens, validateToken } = require('../middlewares/JWT')


router.post("/Register", AuthController.Register); 
router.post("/Login", AuthController.Login); 
router.get("/Profile", validateToken, AuthController.ShowDetails); 


module.exports = router;

