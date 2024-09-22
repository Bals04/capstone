const { GetGymAdminInfo } = require('../models/database');

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
    }
}