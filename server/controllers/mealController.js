const { getTemplateMeals, getMealDetails, updateMealTemplateItem } = require('../models/meals');

module.exports = {
    getTemplateMeals: async (req, res) => {
        try {
            const { template_id } = req.query;
            const data = await getTemplateMeals(template_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching exercises:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getMealDetails: async (req, res) => {
        try {
            const { template_item_id } = req.query;
            const data = await getMealDetails(template_item_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching meal details:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    updateMealDetails: async (req, res) => {
        try {
            const { meal_name, classification, protein, carbohydrates, fats, Template_item_id } = req.query;
            // Log the received data
            console.log('Received data:', {
                meal_name,
                classification,
                protein,
                carbohydrates,
                fats,
                Template_item_id
            });
            const data = await updateMealTemplateItem(meal_name, classification, protein, carbohydrates, fats, Template_item_id);
            res.json(data);
        } catch (error) {
            console.error("Error updating meal details:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
}