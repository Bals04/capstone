const express = require("express");
const router = express.Router();

// Import the PayPal functions (assuming the file is named paypal.js)
const { createPlan,getAllPlansForProduct } = require("../services/paypal.js");  // Adjust path as necessary

// Route for creating a PayPal subscription plan
router.post('/create-plan', async (req, res) => {
    const { planName, price, intervalUnit, intervalCount, productID } = req.body;  // Expect productID from the request

    try {
        const planID = await createPlan(productID, planName, price, intervalUnit, intervalCount);
        res.status(200).json({ message: 'Plan created successfully', planID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating plan' });
    }
});

router.get('/get-plans/', async (req, res) => {
    const { productID } = req.query;

    try {
        const plans = await getAllPlansForProduct(productID);  // Call the function to fetch plans
        res.status(200).json(plans);  // Send the list of plans as JSON
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Error fetching plans' });
    }
});

module.exports = router;
