const express = require("express");
const router = express.Router();
const trainerController = require('../controllers/trainerController');

router.get("/getTrainers", trainerController.getAllTrainers); 
router.get("/getTrainerInfo", trainerController.getTrainerInfo); 
router.get("/getGymTrainer", trainerController.getGymTrainer); 
router.get("/retrieveMemberChatLog", trainerController.retrieveMemberChatLog); 
router.post("/createGymTrainer", trainerController.createGymTrainer); 

module.exports = router;

