const { GetGymAdminInfo } = require('../models/database');
const { getVerifiedAdmins,AddTrainerProfile } = require('../models/gym_admin');

module.exports = {
    GetGymAdminInfo: async (req, res) => {
        try {
            const { account_id } = req.query;
            const data = await GetGymAdminInfo(account_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    
    getVerifiedAdmins: async (req, res) => {
        try {
            const data = await getVerifiedAdmins();
            res.json(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    AddTrainerProfile: async (req, res) => {
        try {
            const { trainer_id, filename } = req.body;
            console.log("Received data on the server[trainer image]:", req.body);
            const data = await AddTrainerProfile(trainer_id, filename);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error", error.message);
        }
    }
}