const express = require("express");
const router = express.Router();
const path = require('path');
const parkController = require('../controllers/parkController');


router.get("/parks", parkController.GetParks); 


module.exports = router;

