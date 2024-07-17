const express = require("express");
const router = express.Router();
const path = require('path');
const trainerController = require('../controllers/trainerController');

router.get("/members", trainerController.getMembers); 

router.get("/exercises", trainerController.getExercises); 

router.post("/addCustomWorkout", trainerController.AddCustom); 

router.get("/getStudentCount", trainerController.getCount); 

router.get("/getTrainerCount", trainerController.getTrainerCount); 

router.get("/getMembers", trainerController.getAllMembers);

router.get("/getTemplates", trainerController.getTemplates);

router.post("/addTemplates", trainerController.AddTemplate);

module.exports = router;

