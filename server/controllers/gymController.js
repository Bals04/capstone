const { getGymInfo, getMealInfo} = require('../models/database');

module.exports = {
    GetGyms: async (req, res) => {
        try {
            const users = await getGymInfo();
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },   
    GetMealInfo: async (req, res) => {
        try {
            const users = await getMealInfo();
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },   
}