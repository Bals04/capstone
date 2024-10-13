const db = require('./database');
const { pool } = require('./database');


const getTemplateMeals = async (template_id) => {
    const [rows] = await pool.query(
        'SELECT m.template_item_id, m.meal_name, m.week_no, m.day_no, s.step_number, s.instruction,m.classification FROM meal_template_items m JOIN meal_item_steps s ON m.template_item_id = s.template_item_id WHERE m.meal_template_id = ? ORDER BY m.week_no ASC, m.day_no ASC, s.step_number',
        [template_id]
    );
    return rows.length > 0 ? rows : null;
};
const getMealDetails = async (template_item_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM `meal_template_items` WHERE template_item_id = ?',
        [template_item_id]
    );
    return rows.length > 0 ? rows : null;
};
const updateMealTemplateItem = async (meal_name, classification, protein, carbohydrates, fats, template_item_id) => {
    // Execute the query to update the meal template item
    const [rows] = await pool.query(
        'UPDATE meal_template_items SET meal_name = ?, classification = ?, protein = ?, carbohydrates = ?, fats = ? WHERE template_item_id = ?;',
        [meal_name, classification, protein, carbohydrates, fats, template_item_id]
    );

    return rows.length > 0 ? rows : null;
};







module.exports = {
    getMealDetails,
    getTemplateMeals,
    updateMealTemplateItem
};
