const { getMembers, getExercises,
    AddCustomWorkout, getStudCount,
    getTrainerCount, getAllMembers,
    getTemplates, AddTemplate, GetTrainerInfo, retrieveMemberChatLog, getTemplateId } = require('../models/database');
const { getAllTrainers, getGymTrainers, insertGymTrainers, insertWorkoutTemplates,
    insertWorkoutTemplateExercise, getGymTrainersById, updateWorkoutTemplateExercise,
    removeTemplateExercise, inputFilter, insertMealTemplates, insertMealTemplatesItems,
    insertMealTemplatesSteps, insertProposal, insertNotification } = require('../models/trainers');

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
            const { template_name, table } = req.query;
            console.log(table)
            const data = await getTemplateId(template_name, table);
            res.json(data);
        } catch (error) {
            console.error("Error fetching id:", error.message);
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
    getGymTrainersById: async (req, res) => {
        try {
            const { trainer_id } = req.query;
            console.log("received data: " + trainer_id)
            const data = await getGymTrainersById(trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching trainer:", error.message);
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
            const { trainer_id, table } = req.query;
            console.log(`TABLE: " ${table}`)
            const data = await getTemplates(trainer_id, table);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    inputFilter: async (req, res) => {
        try {
            const { query, trainer_id } = req.query;
            const data = await inputFilter(query, trainer_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching templates:", error);
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
            const trainerId = await insertGymTrainers(gymid, firstname, lastname, bio, experience, rates, trainerType);
            res.status(200).json({ message: "Trainer added successfully", trainerId: trainerId });

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
    },
    insertMealTemplate: async (req, res) => {
        const { trainer_id, template_name, description } = req.body;
        try {
            const templateId = await insertMealTemplates(trainer_id, template_name, description);
            res.status(200).json({ message: "Meal template added successfully", templateId: templateId });

        } catch (error) {
            console.error("Error adding meal template:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    insertWorkoutTemplateExercise: async (req, res) => {
        const { template_id, exercise_id, exercise_name, reps, sets, muscle_group, week_no, day_no } = req.body;
        try {
            await insertWorkoutTemplateExercise(template_id, exercise_id, exercise_name, reps, sets, muscle_group, week_no, day_no);
            res.status(200).send("Workout template exercises added successfully");

        } catch (error) {
            console.error("Error adding workout template exercises:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    insertMealTemplateItems: async (req, res) => {
        const { meal_template_id, meal_name, classification, protein, carbohydrates, fats, week_no, day_no } = req.body;
        try {
            // Capture the returned insertId
            const insertedMealItemId = await insertMealTemplatesItems(meal_template_id, meal_name, classification, protein, carbohydrates, fats, week_no, day_no);

            // Respond with a success message and the inserted ID
            res.status(200).json({ message: "Meal template item added successfully!", mealItemId: insertedMealItemId });

        } catch (error) {
            console.error("Error adding meal template items:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertMealTemplateSteps: async (req, res) => {
        const { template_item_id, step_number, instruction } = req.body;
        try {
            await insertMealTemplatesSteps(template_item_id, step_number, instruction);
            res.status(200).send("Meal template item steps added successfully!");

        } catch (error) {
            console.error("Error adding steps:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    updateWorkoutTemplateExercise: async (req, res) => {
        const { exercise_name, reps, sets, muscle_group, template_exercise_id } = req.body;
        try {
            await updateWorkoutTemplateExercise(exercise_name, reps, sets, muscle_group, template_exercise_id);
            res.status(200).send("Workout template exercises updated successfully");

        } catch (error) {
            console.error("Error updating workout template exercises:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    removeTemplateExercise: async (req, res) => {
        const { template_exercise_id } = req.query; // Change this line
        console.log("received data", template_exercise_id);
        try {
            await removeTemplateExercise(template_exercise_id);
            res.status(200).send("Workout template exercise deleted successfully");
        } catch (error) {
            console.error("Error deleting workout template exercise:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertProposal: async (req, res) => {
        const { trainer_id, member_id, planType, price, duration, status } = req.body;
        try {
            const proposal_id = await insertProposal(trainer_id, member_id, planType, price, duration, status);
            res.status(200).json({ message: "Proposal added successfully", proposal_id:  proposal_id  });

        } catch (error) {
            console.error("Error adding proposal:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    insertNotification: async (req, res) => {
        const { member_id, proposal_id, message } = req.body;
        try {
            const notification_id = await insertNotification(member_id, proposal_id, message);
            res.status(200).json({ message: "Notification added successfully", notif_id:  notification_id  });

        } catch (error) {
            console.error("Error adding notification:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },


}