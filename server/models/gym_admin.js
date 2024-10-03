const db = require('./database');
const { pool } = require('./database');


const getVerifiedAdmins = async () => {
    const [rows] = await pool.query(
        `SELECT 
        CONCAT(ga.lastname, ', ', ga.firstname) AS gym_admin,
        g.gym_name,
        g.street_address,
        (SELECT plan_name FROM subscriptions WHERE subscription_id = p.subscription_id) AS Subscription,
        CASE
            WHEN  NOW() <= DATE_ADD(p.payment_date, INTERVAL (SELECT duration_months FROM subscriptions WHERE subscription_id = p.subscription_id) MONTH)  THEN 'Active'
            ELSE 'Inactive'
        END AS membership_status
        FROM gym_admin ga
        JOIN gyms g ON ga.admin_id = g.admin_id
        JOIN payments_table p ON p.gym_id = g.gym_id;
`,);

    return rows;
};


module.exports = {
    getVerifiedAdmins
};
