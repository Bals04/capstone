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
}

exports.createOrder = async (admin_id, gym_id, subscriptionID, price, subscriptionName, days) => {
    const access_token = await generateAccessToken();

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
                            name: subscriptionName,
                            description: 'Subscription to list your gym on our map',
                            quantity: '1',
                            unit_amount: {
                                currency_code: 'PHP',
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
                return_url: `${process.env.BASE_URL}/complete-order?admin_id=${admin_id}&gym_id=${gym_id}&subscriptionID=${subscriptionID}&price=${price}&day=${days}`,
                cancel_url: process.env.BASE_URL + '/cancel-order',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'FLEXPERIENCE PAGE'
            }
        })
    });

    return response.data.links.find(link => link.rel == 'approve').href;
};

// para sa client to trainer payment shet wako kasabot unsay sunod
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
