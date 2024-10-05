const express = require("express");
const router = express.Router();
const path = require('path');
const mealController = require('../controllers/mealController');


router.get("/getMealsById", mealController.getTemplateMeals); 


module.exports = router;

