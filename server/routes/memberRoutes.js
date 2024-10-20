const express = require("express");
const router = express.Router();
const path = require('path');
const memberController = require('../controllers/memberController');

router.get("/getWorkoutOftheWeek", memberController.GetTodaysMeal); 
router.get("/WorkoutOftheDay", memberController.GetTodaysWorkout); 
router.get("/getMemberInfo", memberController.getMemberInfo); 
router.get("/retrieveTrainerChatLog", memberController.retrieveTrainerchatLog); 
router.get("/retrieveNotifications", memberController.getNotifications); 
router.get("/getPlan", memberController.getPlan); 
router.get("/retrieveProposals", memberController.getProposals); 
router.post("/insertContracts", memberController.insertContract); 
router.post("/insertActivity", memberController.insertActivity); 
router.put("/updateExerciseStatus", memberController.updateExerciseStatus); 

module.exports = router;

