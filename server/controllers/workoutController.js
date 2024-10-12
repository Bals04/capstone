const { getTemplateExercises } = require('../models//workouts');

module.exports = {
    getTemplateExercises: async (req, res) => {
        try {
            const { template_id } = req.query;
            const data = await getTemplateExercises(template_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching exercises:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}