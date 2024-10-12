const express = require("express");
const router = express.Router();
const path = require('path');
const workoutController = require('../controllers/workoutController');


router.get("/getWorkoutsById", workoutController.getTemplateExercises); 


module.exports = router;

