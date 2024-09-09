// navRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const { handleAddPaymentRecord } = require('../controllers/orderController');
const { VerifyGym } = require('../controllers/gymController');
const paypal = require('../services/paypal');

router.get('/gym_admin/success', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/gym_admin/gymAdminDashboard.html'));
});

router.get('/complete-order', async (req, res) => {
    try {
        const token = req.query.token;
        const admin_id = req.query.admin_id;
        const gym_id = req.query.gym_id;
        const subscription_id = req.query.subscriptionID;
        const price = req.query.price;

        // Capture the payment using the token from PayPal
        const captureResponse = await paypal.capturePayment(token);

        if (captureResponse && captureResponse.status === 'COMPLETED') {
            // Payment was successful, proceed to add payment record to the database
            const paymentData = {
                admin_id,
                gym_id,
                subscription_id,
                amount: price,
                payment_status: 'COMPLETED'
            };

            // Call the controller to add the payment record
            const result = await handleAddPaymentRecord(
                paymentData.admin_id,
                paymentData.gym_id,
                paymentData.subscription_id,
                paymentData.amount,
                paymentData.payment_status
            );

            if (result.success) {
                // Call VerifyGym if payment record was added successfully
                await VerifyGym(gym_id); // Directly pass gym_id here

                // Redirect to the success page
                return res.redirect('/gym_admin/success');
            } else {
                throw new Error(result.message);
            }
        } else {
            throw new Error('Payment capture was not successful.');
        }
    } catch (error) {
        console.error("Error completing the order:", error.message);
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
