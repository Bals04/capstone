const db = require('./database');
const { pool } = require('./database');

const getAllTrainers = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM gym_trainer'
    );
    return rows.length > 0 ? [rows] : null;
};
const getGymTrainers = async (gym_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM gym_trainer WHERE gym_id = ?',
        [gym_id]
    );
    return rows.length > 0 ? rows : null;
};




module.exports = {
    getAllTrainers,
    getGymTrainers
};
