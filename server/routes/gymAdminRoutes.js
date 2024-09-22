const express = require("express");
const router = express.Router();
const gymAdmin = require('../controllers/gymAdminController');

router.get("/getGymAdminInfo", gymAdmin.GetGymAdminInfo); 


module.exports = router;

