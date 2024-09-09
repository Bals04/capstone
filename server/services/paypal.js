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

exports.createOrder = async (admin_id, gym_id, subscriptionID, price, subscriptionName) => {
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
                return_url: `${process.env.BASE_URL}/complete-order?admin_id=${admin_id}&gym_id=${gym_id}&subscriptionID=${subscriptionID}&price=${price}`,
                cancel_url: process.env.BASE_URL + '/cancel-order',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'FLEXPERIENCE PAGE'
            }
        })
    });

    return response.data.links.find(link => link.rel == 'approve').href;
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
