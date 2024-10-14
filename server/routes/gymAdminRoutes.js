const express = require("express");
const router = express.Router();
const gymAdmin = require('../controllers/gymAdminController');

router.get("/getGymAdminInfo", gymAdmin.GetGymAdminInfo); 
router.get("/getVerifiedAdmins", gymAdmin.getVerifiedAdmins); 
router.get("/getSales", gymAdmin.getSales); 
router.get("/getTrainerSales", gymAdmin.getTrainerSales); 
router.post("/insertTrainerImage", gymAdmin.AddTrainerProfile); 


module.exports = router;

