const db = require('./database');
const { pool } = require('./database');

const getNotifications = async (member_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM notifications WHERE member_id = ? ORDER BY created_at DESC',
        [member_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const getProposals = async (member_id, proposal_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM proposals WHERE member_id = ? AND proposal_id = ?',
        [member_id, proposal_id]
    );
    return rows.length > 0 ? [rows] : null;
};

module.exports = {
    getNotifications,
    getProposals
};
