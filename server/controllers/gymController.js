const { getGymInfo, getMealInfo, inputFilter, RegisterGym,
    AddGymDocuments, AddGymLogo, getPendingGyms, ApproveRequest,
    getPaymentPendingGyms, getPendingGymsByID, verifyGymInDb, getVerifiedGyms, GetGymData, getGymsByID, getAllVerifiedGyms } = require('../models/database');

module.exports = {
    GetGyms: async (req, res) => {
        try {
            const users = await getGymInfo();
            res.json(users);
        } catch (error) {
            console.error("Error fetching gyms:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    GetGymsByID: async (req, res) => {
        const { admin_id } = req.query;
        try {
            console.log("received data: ", admin_id)
            const gymData = await getGymsByID (admin_id); 
            if (gymData) {
                res.json(gymData); // Send gym data back to the frontend if response == 200 heehee
            } else {
                res.status(404).send("Gym not found");
            }
        } catch (error) {
            console.error("Error fetching gym data:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    // Controller function to get gym data by ID
    GetGymData: async (req, res) => {
        const gymId = req.query.gymid; // Extract the gym ID from the request URL
        try {
            const gymData = await GetGymData(gymId); // Fetch gym data from the database
            if (gymData) {
                res.json(gymData); // Send gym data back to the frontend
            } else {
                res.status(404).send("Gym not found");
            }
        } catch (error) {
            console.error("Error fetching gym data:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getPendingGyms: async (req, res) => {
        try {
            const users = await getPendingGyms();
            res.json(users);
        } catch (error) {
            console.error("Error fetching pending gyms:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getPendingGymsByID: async (req, res) => {
        try {
            const { admin_id } = req.query;
            const data = await getPendingGymsByID(admin_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching pending gyms:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    getPaymentPendingGyms: async (req, res) => {
        try {
            const { admin_id } = req.query;
            const users = await getPaymentPendingGyms(admin_id);
            res.json(users);
        } catch (error) {
            console.error("Error fetching payment pending gyms:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getPaymentPendingGyms: async (req, res) => {
        try {
            const { admin_id } = req.query;
            const users = await getPaymentPendingGyms(admin_id);
            res.json(users);
        } catch (error) {
            console.error("Error fetching payment pending gyms:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    getAllVerifiedGyms: async (req, res) => {
        try {
            const users = await getAllVerifiedGyms();
            res.json(users);
        } catch (error) {
            console.error("Error fetching verified gyms:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },

    getVerifiedGyms: async (req, res) => {
        try {
            const { admin_id } = req.query;
            const data = await getVerifiedGyms(admin_id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching verified gyms:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    ApproveRequest: async (req, res) => {
        try {
            const { gym_id } = req.body;
            await ApproveRequest(gym_id);
            res.json({ success: true });
        } catch (error) {
            console.error("Error fetching pending gyms:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    VerifyGym: async (gym_id) => {
        try {
            await verifyGymInDb(gym_id);  // Use the passed gym_id directly
            return { success: true };
        } catch (error) {
            console.error("Error verifying gym:", error);
            throw new Error("Failed to verify gym");
        }
    },

    GetMealInfo: async (req, res) => {
        try {
            const users = await getMealInfo();
            res.json(users);
        } catch (error) {
            console.error("Error fetching meals:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    SearchFilter: async (req, res) => {
        try {
            const { userInput } = req.query;
            const data = await inputFilter(userInput);
            res.json(data);
        } catch (error) {
            console.error("Error fetching filtered data:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    RegisterGym: async (req, res) => {
        try {
            const { admin_id, gymname, latitude, longtitude, daily_rate, monthly_rate, contact_no, street_address, status } = req.body;
            console.log("Received data on the server:", req.body);
            const data = await RegisterGym(admin_id, gymname, latitude, longtitude, daily_rate, monthly_rate, contact_no, street_address, status);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            res.status(500).send("Internal Server Error");
        }
    },
    AddGymDocuments: async (req, res) => {
        try {
            const { document_type, document_path } = req.body;
            console.log("Received data on the server[document]:", req.body);
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
            console.log("Received data on the server[logo]:", req.body);
            const data = await AddGymLogo(img_path);
            res.json(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}