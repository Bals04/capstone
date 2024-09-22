const express = require("express");
const router = express.Router();
const path = require('path');
const memberController = require('../controllers/memberController');

router.get("/getWorkoutOftheWeek", memberController.GetTodaysMeal); 
router.get("/WorkoutOftheDay", memberController.GetTodaysWorkout); 
router.get("/getMemberInfo", memberController.getMemberInfo); 
router.get("/retrieveTrainerChatLog", memberController.retrieveTrainerchatLog); 

module.exports = router;

