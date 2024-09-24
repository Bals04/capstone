const express = require("express");
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const validation = require('../middlewares/validation')
const trainerSchema = require('../validations/trainerValidations')

router.get("/getTrainers", trainerController.getAllTrainers); 
router.get("/getTrainerInfo", trainerController.getTrainerInfo); 
router.get("/getGymTrainer", trainerController.getGymTrainer); 
router.get("/retrieveMemberChatLog", trainerController.retrieveMemberChatLog); 
router.get("/getTemplates", trainerController.getTemplates); 
router.post("/createGymTrainer",validation(trainerSchema), trainerController.createGymTrainer); 
router.post("/createWorkoutTemplate", trainerController.insertWorkoutTemplate); 

module.exports = router;

