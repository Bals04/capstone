const express = require('express');
const router = express.Router();
const paypal = require('../services/paypal');

router.post('/pay', async (req, res) => {
    const { admin_id, gym_id, subscriptionID, price, subscriptionName, days } = req.body;
    try {
        const url = await paypal.createOrder(admin_id, gym_id, subscriptionID, price, subscriptionName, days);
        res.send(url); // Send the PayPal approval URL
    } catch (error) {
        res.send("ERROR: " + error.message);
    }
});

module.exports = router;
