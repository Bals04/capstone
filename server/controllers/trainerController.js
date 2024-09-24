const { getMembers, getExercises,
    AddCustomWorkout, getStudCount,
    getTrainerCount, getAllMembers,
    getTemplates, AddTemplate, GetTrainerInfo, retrieveMemberChatLog, getTemplateId } = require('../models/database');
const { getAllTrainers, getGymTrainers, insertGymTrainers, insertWorkoutTemplates } = require('../models/trainers');

module.exports = {

    getTrainerInfo: async (req, res) => {
        try {
            const { user_id } = req.query;
            console.log("query: " + user_id)
            const data = await GetTrainerInfo(user_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching trainer:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getTemplateId: async (req, res) => {
        try {
            const { template_name } = req.query;
            console.log("received template nane: " + template_name)
            const data = await getTemplateId(template_name);
            res.json(data);
        } catch (error) {
            console.error("Error fetching trainer:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    retrieveMemberChatLog: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            console.log("received data: ", trainer_id)
            const data = await retrieveMemberChatLog(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getGymTrainer: async (req, res) => {
        try {
            const gym_id = req.query.gymid;
            console.log("received data: " + gym_id)
            const data = await getGymTrainers(gym_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    getMembers: async (req, res) => {
        try {
            const data = await getMembers();
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getAllTrainers: async (req, res) => {
        try {
            const data = await getAllTrainers();
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
        const { member_id, exercise_id, reps, sets, workout_date, status } = req.body;
        try {
            await AddCustomWorkout(member_id, exercise_id, reps, sets, workout_date, status);
            res.status(200).send("Workout added successfully"); // Correct way to send status and a message

        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getCount: async (req, res) => {
        try {
            const data = await getStudCount();
            res.json(data);
        } catch (error) {
            console.error("Error fetching dataaa - ctr:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getTrainerCount: async (req, res) => {
        try {
            const data = await getTrainerCount();
            res.json(data);
        } catch (error) {
            console.error("Error fetching dataaa - ctr:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getAllMembers: async (req, res) => {
        try {
            const data = await getAllMembers();
            res.json(data);
        } catch (error) {
            console.error("Error fetching dataaa - ctr:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getTemplates: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            const data = await getTemplates(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    AddTemplate: async (req, res) => {
        const { trainer_id, name, desc } = req.body;
        try {
            await AddTemplate(trainer_id, name, desc);
            res.status(200).send("Template added successfully");

        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    createGymTrainer: async (req, res) => {
        const { gymid, firstname, lastname, bio, experience, rates, trainerType } = req.body;
        try {
            await insertGymTrainers(gymid, firstname, lastname, bio, experience, rates, trainerType);
            res.status(200).send("Trainer added successfully");

        } catch (error) {
            console.error("Error adding trainer:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertWorkoutTemplate: async (req, res) => {
        const { trainer_id, template_name, description } = req.body;
        try {
            await insertWorkoutTemplates(trainer_id, template_name, description);
            res.status(200).send("Workout template added successfully");

        } catch (error) {
            console.error("Error adding workout template:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }

}