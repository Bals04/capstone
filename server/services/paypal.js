const axios = require('axios');

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    });

    return response.data.access_token;
}
async function generateAccessToken2() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_TRAINER_ID,
            password: process.env.PAYPAL_SECRET_TRAINER
        }
    });

    return response.data.access_token;
};

exports.createSubscription = async (admin_id, gym_id, planID, subscriptionID, subscriptionName, days, price) => {
    const access_token = await generateAccessToken();

    // Send request to create subscription
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/billing/subscriptions',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        data: {
            plan_id: planID, // Use the planID here
            subscriber: {
                name: {
                    given_name: 'John', // Replace with dynamic values as necessary
                    surname: 'Doe'
                },
                email_address: 'customer@example.com'
            },
            application_context: {
                return_url: `${process.env.BASE_URL}/complete-order?admin_id=${admin_id}&gym_id=${gym_id}&price=${price}&subscriptionID=${subscriptionID}&subscriptionName=${encodeURIComponent(subscriptionName)}&days=${days}&planID=${planID}`,
                cancel_url: process.env.BASE_URL + '/cancel-order',
            }
        }
    });

    const paypalsubscriptionId = response.data.id;
    const approvalLink = response.data.links.find(link => link.rel === 'approve').href;
    const completeOrderUrl = `${process.env.BASE_URL}/complete-order?admin_id=${admin_id}&gym_id=${gym_id}&paypalsubscriptionID=${paypalsubscriptionId}&subscriptionID=${subscriptionID}&subscriptionName=${encodeURIComponent(subscriptionName)}&days=${days}&planID=${planID}`;

    return {
        paypalsubscriptionId: paypalsubscriptionId,
        approvalLink: approvalLink,
        completeOrderUrl: completeOrderUrl
    };
};
// para sa client to trainer payment
exports.createClientToTrainerPayment = async (contract_id, price, planType, duration) => {
    const access_token = await generateAccessToken2();
    console.log("GENERATED V2 TOKEN: ", access_token)
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: [
                        {
                            name: planType,
                            description: `Payment for ${duration} week plan with trainer`,
                            quantity: '1',
                            unit_amount: {
                                currency_code: 'PHP', // Change to your preferred currency
                                value: price
                            }
                        }
                    ],
                    amount: {
                        currency_code: 'PHP',
                        value: price,
                        breakdown: {
                            item_total: {
                                currency_code: 'PHP',
                                value: price
                            }
                        }
                    }
                }
            ],
            application_context: {
                return_url: `${process.env.BASE_URL}/complete-client-payment?contract_id=${contract_id}&price=${price}`,
                cancel_url: process.env.BASE_URL + '/cancel-client-payment',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'TRAINER PAYMENT'
            }
        })
    });

    return response.data.links.find(link => link.rel === 'approve').href;
};

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    return response.data;
};
exports.captureClientPayment = async (orderId) => {
    const accessToken = await generateAccessToken2();

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    return response.data;
};


exports.getSubscriptionDetails = async (subscriptionID) => {
    console.log("Received subscription ID: ", subscriptionID);

    const accessToken = await generateAccessToken();

    try {
        const response = await axios({
            url: `${process.env.PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionID}`,
            method: 'get',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log("RESPONSE: ", response.data);
        return response.data; // This will contain subscription details
    } catch (error) {
        console.error("Error fetching subscription details:", error.response ? error.response.data : error.message);
        throw error; // Rethrow to handle in the calling function
    }
};

