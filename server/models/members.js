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
const insertContract = async (proposal_id, weeks, status) => {
    const [response] = await pool.query(
        `INSERT INTO contracts_table (proposal_id, start_date, end_date, status) 
         VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ${weeks} WEEK), ?);`,
        [proposal_id, status]
    );
    return response.insertId;  // This will return the auto-incremented ID
};


module.exports = {
    getNotifications,
    getProposals,
    insertContract
};
