const express = require("express");
const router = express.Router();
const path = require('path');
const GymController = require('../controllers/gymController');
const trainerController = require('../controllers/trainerController');

router.get("/gyms", GymController.GetGyms); 
router.get("/members", trainerController.getMembers); 
router.get("/meals", GymController.GetMealInfo); 
router.get("/searchFilter", GymController.SearchFilter); 
router.get("/getPendingGyms", GymController.getPendingGyms); 
router.get("/getPendingGymsByID", GymController.getPendingGymsByID); 
router.get("/getPaymentPendingGyms", GymController.getPaymentPendingGyms); 
router.get("/getVerifiedGyms", GymController.getVerifiedGyms); 
router.post("/RegisterGym", GymController.RegisterGym); 
router.post("/AddGymDocuments", GymController.AddGymDocuments); 
router.post("/AddGymLogo", GymController.AddGymLogo); 
router.put("/ApproveGym", GymController.ApproveRequest); 

module.exports = router;

