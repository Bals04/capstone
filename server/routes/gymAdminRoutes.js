const express = require("express");
const router = express.Router();
const gymAdmin = require('../controllers/gymAdminController');

router.get("/getGymAdminInfo", gymAdmin.GetGymAdminInfo); 
router.get("/getVerifiedAdmins", gymAdmin.getVerifiedAdmins); 


module.exports = router;

