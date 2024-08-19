const express = require("express");
const router = express.Router();
const path = require('path');
const GymController = require('../controllers/gymController');
const trainerController = require('../controllers/trainerController');

router.get("/gyms", GymController.GetGyms); 
router.get("/members", trainerController.getMembers); 
router.get("/meals", GymController.GetMealInfo); 
router.get("/searchFilter", GymController.SearchFilter); 

module.exports = router;

