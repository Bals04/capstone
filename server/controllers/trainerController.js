const { getMembers, getExercises, AddCustomWorkout} = require('../models/database');

module.exports = {
    getMembers: async (req, res) => {
        try {
            const data = await getMembers();
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getExercises: async (req, res) => {
        try {
            const data = await getExercises();
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    AddCustom: async (req, res) => {
        const { member_id, exercise_id, reps, sets, week_no, day_no, status } = req.body;
        try {
            await AddCustomWorkout(member_id, exercise_id, reps, sets, week_no, day_no, status);
            res.status(200).send("Workout added successfully"); // Correct way to send status and a message

        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).send("Internal Server Error");
        }
    }  
}