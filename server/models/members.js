const db = require('./database');
const { pool } = require('./database');

const getNotifications = async (member_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM notifications WHERE member_id = ?',
        [member_id]
    );
    return rows.length > 0 ? [rows] : null;
};

module.exports = {
    getNotifications
};
