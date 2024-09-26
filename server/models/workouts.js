const db = require('./database');
const { pool } = require('./database');


const getTemplateExercises = async (template_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM template_exercises WHERE template_id = ?',
        [template_id]
    );
    return rows.length > 0 ? rows : null;
};





module.exports = {
    getTemplateExercises
};
