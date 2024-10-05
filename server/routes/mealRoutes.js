const express = require("express");
const router = express.Router();
const path = require('path');
const mealController = require('../controllers/mealController');


router.get("/getMealsById", mealController.getTemplateMeals); 
router.get("/getMealDetails", mealController.getMealDetails); 
router.put("/updateMealDetails", mealController.updateMealDetails); 


module.exports = router;

