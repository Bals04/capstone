const db = require('./database');


const createUser = async ({ username, password }) => {
    return db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password]
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
    findOne,
    getUserinfo
};
