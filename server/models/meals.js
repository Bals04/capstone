const db = require('./database');
const { pool } = require('./database');


const getTemplateMeals = async (template_id) => {
    const [rows] = await pool.query(
        'SELECT m.meal_name, m.week_no, m.day_no, s.step_number, s.instruction FROM meal_template_items m JOIN meal_item_steps s ON m.template_item_id = s.template_item_id WHERE m.meal_template_id = ? ORDER BY m.week_no ASC, m.day_no ASC, s.step_number',
        [template_id]
    );
    return rows.length > 0 ? rows : null;
};





module.exports = {
    getTemplateMeals
};
