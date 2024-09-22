const db = require('./database');
const { pool } = require('./database');

const getAllTrainers = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM trainers'
    );
    return rows.length > 0 ? [rows] : null;
};
const getGymTrainers = async (gym_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM trainers WHERE gym_id = ?',
        [gym_id]
    );
    return rows.length > 0 ? rows : null;
};
const insertGymTrainers = async (gymid, userid, firstname, lastname, bio, experience, rates, trainerType) => {
    const [rows] = await pool.query(
        'INSERT INTO trainers (gym_id, account_id, firstname, lastname, bio, experience, rates, trainer_type) VALUES(?,(SELECT account_id FROM user_accounts ORDER BY account_id desc LIMIT 1),?,?,?,?,?,?)',
        [gymid, userid, firstname, lastname, bio, experience, rates, trainerType]
    );
    return rows.length > 0 ? rows : null;
};




module.exports = {
    insertGymTrainers,
    getAllTrainers,
    getGymTrainers
};
