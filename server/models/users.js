const db = require('./database');


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
// Find one user by username
const findOne = async ({ username }) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ? LIMIT 1',
        [username]
    );
    return rows[0]; // Return the first row (or undefined if no user was found)
};
const getUserinfo = async ({ user_id }) => {
    const [rows] = await db.query(
        'SELECT * FROM user_info WHERE user_id = ? LIMIT 1',
        [user_id]
    );
    return rows[0]; // Return the first row (or undefined if no user was found)
};

module.exports = {
    createUser,
    createGymAdmin,
    findOne,
    getUserinfo
};
