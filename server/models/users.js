const db = require('./database');
const { pool } = require('./database');

const createUser = async ({ username, password, usertype }) => {
    return db.query(
        'INSERT INTO user_accounts (username, password, user_type) VALUES (?,?,?)',
        [username, password, usertype]
    );
};
const createGymAdmin = async ({ firstname, lastname, email }) => {
    return db.query(
        'INSERT INTO gym_admin (account_id,firstname, lastname, email) VALUES((SELECT account_id FROM user_accounts ORDER BY account_id desc LIMIT 1),?,?,?)',
        [firstname, lastname, email]
    );
};
const createMember = async ({ firstname, lastname, weight, bodytype, }) => {
    return db.query(
        'INSERT INTO members (account_id,firstname, lastname, weight, bodytype) VALUES((SELECT account_id FROM user_accounts ORDER BY account_id desc LIMIT 1),?,?,?,?)',
        [firstname, lastname, weight, bodytype]
    );
};
// Find one user by username
const findOne = async ({ username }) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM user_accounts WHERE username = ? LIMIT 1',
            [username]
        );
        // Since rows is an array, return the first element or null if no result found
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error querying database:", error.message);
        throw error;
    }
};

const getUserinfo = async ({ account_id }) => {
    const [rows] = await db.query(
        'SELECT * FROM gym_admin WHERE account_id = ? LIMIT 1',
        [account_id]
    );
    return rows[0]; // Return the first row (or undefined if no user was found)
};

module.exports = {
    createUser,
    createGymAdmin,
    findOne,
    getUserinfo,
    createMember
};
