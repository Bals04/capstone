const { getWorkoutOftheWeek, getWorkoutoftheDay, GetMemberInfo, retrieveTrainerchatLog} = require('../models/database');
const { getNotifications,getProposals } = require('../models/members');

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
            const { memberId, week} = req.query;
            const data = await getWorkoutoftheDay(memberId, week);
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

    getProposals: async (req, res) => {
        try {
            const { member_id, proposal_id } = req.query;
            const data = await getProposals(member_id, proposal_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching members proposals:", error.message);
            res.status(500).send("Internal Server Error");
        }
    }
}