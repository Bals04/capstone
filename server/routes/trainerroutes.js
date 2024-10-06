const express = require("express");
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const validation = require('../middlewares/validation')
const trainerSchema = require('../validations/trainerValidations')
const templateSchema = require('../validations/templateValidations')
const exerciseSchema = require('../validations/templateExercisesValidations')

router.get("/getTrainers", trainerController.getAllTrainers); 
router.get("/getTrainerInfo", trainerController.getTrainerInfo); 
router.get("/getGymTrainer", trainerController.getGymTrainer); 
router.get("/getGymTrainerById", trainerController.getGymTrainersById); 
router.get("/retrieveMemberChatLog", trainerController.retrieveMemberChatLog); 
router.get("/getTemplates", trainerController.getTemplates); 
router.get("/getTemplateId", trainerController.getTemplateId); 
router.get("/getByQuery", trainerController.inputFilter); 
router.post("/createGymTrainer",validation(trainerSchema), trainerController.createGymTrainer); 
router.post("/createWorkoutTemplate",validation(templateSchema), trainerController.insertWorkoutTemplate); 
router.post("/createMealTemplate", trainerController.insertMealTemplate); 
router.post("/createMealTemplateItems", trainerController.insertMealTemplateItems); 
router.post("/createMealSteps", trainerController.insertMealTemplateSteps); 
router.post("/insertProposal", trainerController.insertProposal); 
router.post("/createWorkoutTemplateExercises",validation(exerciseSchema), trainerController.insertWorkoutTemplateExercise); 
router.put("/ModifyWorkoutTemplateExercises", trainerController.updateWorkoutTemplateExercise); 
router.delete("/RemoveWorkoutTemplateExercises", trainerController.removeTemplateExercise); 

module.exports = router;

