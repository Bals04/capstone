const express = require("express");
const router = express.Router();
const path = require('path');
const trainerController = require('../controllers/trainerController');

router.get("/members", trainerController.getMembers); 

router.get("/exercises", trainerController.getExercises); 

router.post("/addCustomWorkout", trainerController.AddCustom); 

module.exports = router;

