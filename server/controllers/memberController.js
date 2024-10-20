const { getWorkoutOftheWeek, GetMemberInfo, retrieveTrainerchatLog} = require('../models/database');
const { getNotifications,getProposals,insertContract,getWorkoutoftheDay,getPlan, updateExerciseStatus,insertActivity } = require('../models/members');

module.exports = {
    GetTodaysMeal: async (req, res) => {
        try {
            const { memberId, weekNo} = req.query;
            const users = await getWorkoutOftheWeek(memberId, weekNo);
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },    
    GetTodaysWorkout: async (req, res) => {
        try {
            const { member_id, plan_id } = req.query;
            const data = await getWorkoutoftheDay(member_id, plan_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getMemberInfo: async (req, res) => {
        try {
            const { account_id } = req.query;
            console.log(account_id)
            const data = await GetMemberInfo(account_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    updateExerciseStatus: async (req, res) => {
        const { status_id, status } = req.body;
        try {
            await updateExerciseStatus(status, status_id);
            res.status(200).send("Workout exercise updated successfully");

        } catch (error) {
            console.error("Error updating workout template exercises:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    retrieveTrainerchatLog: async (req, res) => {
        try {
            const { member_id } = req.query;
            console.log("received data: ", member_id)
            const data = await retrieveTrainerchatLog(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members chatlog:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    getNotifications: async (req, res) => {
        try {
            const { member_id } = req.query;
            console.log("received data: ", member_id)
            const data = await getNotifications(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members notifications:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getPlan: async (req, res) => {
        try {
            const { member_id } = req.query;
            console.log("received data: ", member_id)
            const data = await getPlan(member_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members plan ID:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    getProposals: async (req, res) => {
        try {
            const { member_id, proposal_id } = req.query;
            const data = await getProposals(member_id, proposal_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members proposals:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    insertContract: async (req, res) => {
        try {
            const { proposal_id, weeks, status } = req.body;
            const data = await insertContract(proposal_id, weeks, status);
            res.status(200).json({ message: "Contract added successfully", contract_id:  data  });
        } catch (error) {
            console.error("Error adding contracts:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    
    insertActivity: async (req, res) => {
        try {
            const { member_id, trainer_id, message } = req.body;
            const data = await insertActivity(member_id, trainer_id, message);
            res.status(200).json({ message: "Activity added successfully", activity_id:  data  });
        } catch (error) {
            console.error("Error adding contracts:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
}