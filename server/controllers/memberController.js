const { getWorkoutOftheWeek, getWorkoutoftheDay, GetMemberInfo} = require('../models/database');

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
    }
}