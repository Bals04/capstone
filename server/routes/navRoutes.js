// navRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const { handleAddPaymentRecord, addSubscriptionRecord, handleClientPayment } = require('../controllers/orderController');
const { VerifyGym } = require('../controllers/gymController');
const paypal = require('../services/paypal');

router.get('/gym_admin/success', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/gym_admin/gymAdminDashboard.html'));
});

router.get('/complete-order', async (req, res) => {
    try {
        const admin_id = req.query.admin_id;
        const gym_id = req.query.gym_id;
        const plan_id = req.query.planID; // Updated to use planID instead of subscriptionID
        const price = req.query.price; // Store this for logging or other purposes
        const day = req.query.days;
        const subscription_id = req.query.subscriptionID;

        console.log("Plan ID:", plan_id);
        console.log("amount: ", price)
        // Payment was successful, proceed to add payment record to the database
        const paymentData = {
            admin_id,
            gym_id,
            subscription_id: subscription_id, // Use the plan ID from your database
            amount: price,
            payment_status: 'COMPLETED'
        };

        // Call the controller to add the payment record
        const result = await handleAddPaymentRecord(
            paymentData.admin_id,
            paymentData.gym_id,
            paymentData.subscription_id, // This is now the plan ID
            paymentData.amount,
            paymentData.payment_status
        );

        if (result.success) {
            // Call VerifyGym if payment record was added successfully
            await VerifyGym(gym_id); // Directly pass gym_id here
            await addSubscriptionRecord(admin_id, gym_id, subscription_id, day); // Use the plan ID here

            // Redirect to the success page
            return res.redirect('/gym_admin/success');
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error("Error completing the order:", error.message);
        // Ensure headers are sent only once
        if (!res.headersSent) {
            res.status(500).send("Error: " + error.message);
        }
    }
});



router.get('/complete-client-payment', async (req, res) => {
    try {
        const token = req.query.token;
        const contract_id = req.query.contract_id;
        const price = req.query.price;

        // Capture the payment using the token from PayPal
        const captureResponse = await paypal.captureClientPayment(token);

        if (captureResponse && captureResponse.status === 'COMPLETED') {
            // Payment was successful, proceed to add payment record to the database
            const paymentData = {
                contract_id: contract_id,
                amount: price,
            };

            // Call the controller to add the payment record
            const result = await handleClientPayment(paymentData.contract_id, paymentData.amount);

            if (result.success) {
                // Call VerifyGym if payment record was added successfully
                // await VerifyGym(gym_id); // Directly pass gym_id here
                // await addSubscriptionRecord(admin_id, gym_id, subscription_id, day)
                console.log("SUCCESS")
                // Redirect to the success page
                return res.redirect('/gym_admin/success');
            } else {
                console.log("ERROR")
                throw new Error(result.message);
            }
        } else {
            throw new Error('Payment capture was not successful.');
        }
    } catch (error) {
        console.error("Error completing the client order:", error.message);
        // Ensure headers are sent only once
        if (!res.headersSent) {
            res.status(500).send("Error: " + error.message);
        }
    }
});

router.get('/cancel-order', (req, res) => {
    res.redirect('/');
});

module.exports = router;
