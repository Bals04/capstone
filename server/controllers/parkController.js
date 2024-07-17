const { getParkInfo } = require('../models/database');

module.exports = {
    GetParks: async (req, res) => {
        try {
            const parks = await getParkInfo();
            res.json(parks);
        } catch (error) {
            console.error("Error fetching parks:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}