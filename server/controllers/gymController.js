const { getGymInfo, getMealInfo, inputFilter, RegisterGym, AddGymDocuments, AddGymLogo} = require('../models/database');

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
    SearchFilter: async (req, res) => {
        try {
            const { userInput } = req.query;
            const data = await inputFilter(userInput);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    RegisterGym: async (req, res) => {
        try {
            const { gymname, latitude, longtitude, daily_rate, monthly_rate, contact_no, street_address, status } = req.body;
            console.log("Received data on the server:", req.body); 
            const data = await RegisterGym(gymname, latitude, longtitude, daily_rate, monthly_rate, contact_no, street_address, status);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    AddGymDocuments: async (req, res) => {
        try {
            const { document_type, document_path } = req.body;
            console.log("Received data on the server:", req.body); 
            const data = await AddGymDocuments(document_type, document_path);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    AddGymLogo: async (req, res) => {
        try {
            const { img_path } = req.body;
            console.log("Received data on the server:", req.body); 
            const data = await AddGymLogo(img_path);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}