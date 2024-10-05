const { getTemplateMeals } = require('../models/meals');

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
    }
}