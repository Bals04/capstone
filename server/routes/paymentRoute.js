const express = require('express');
const router = express.Router();
const paypal = require('../services/paypal');

router.post('/pay', async (req, res) => {
    const { admin_id, gym_id, planID, subscriptionID, subscriptionName, days, price } = req.body;
    try {
        const { approvalLink } = await paypal.createSubscription(admin_id, gym_id, planID, subscriptionID, subscriptionName, days, price); // Pass the correct parameters
        console.log("------------")
        console.log(days)
        res.send({ approvalLink }); // Send the PayPal approval URL for the subscription
    } catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
});


router.post('/clientPayment', async (req, res) => {
    const { contract_id, price, planType, duration } = req.body;
    try {
        const url = await paypal.createClientToTrainerPayment(contract_id, price, planType, duration);
        res.send(url); // Send the PayPal approval URL
    } catch (error) {
        res.send("ERROR: " + error.message);
    }
});

module.exports = router;
