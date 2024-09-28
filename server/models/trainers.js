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
const getGymTrainersById = async (trainer_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM trainers WHERE trainer_id = ?',
        [trainer_id]
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
const insertWorkoutTemplates = async (trainer_id, template_name, description) => {
    const [rows] = await pool.query(
        'INSERT INTO workout_plan_templates (trainer_id, template_name, description) VALUES(?,?,?)',
        [trainer_id, template_name, description]
    );
    return rows.length > 0 ? rows : null;
};
const insertWorkoutTemplateExercise = async (template_id, exercise_id, exercise_name, reps, sets, muscle_group, week_no, day_no) => {
    const [rows] = await pool.query(
        'INSERT INTO template_exercises (template_id, exercise_id, exercise_name, repetitions, sets, target_muscle_group, week_no, day_no) VALUES(?,?,?,?,?,?,?,?)',
        [template_id, exercise_id, exercise_name, reps, sets, muscle_group, week_no, day_no]
    );
    return rows.length > 0 ? rows : null;
};
const updateWorkoutTemplateExercise = async (exercise_name, reps, sets, muscle_group, template_exercise_id) => {
    const [rows] = await pool.query(
        'UPDATE template_exercises SET exercise_name = ?, repetitions = ?, sets = ?, target_muscle_group = ? WHERE template_exercise_id = ?;',
        [exercise_name, reps, sets, muscle_group, template_exercise_id]
    );
    return rows.length > 0 ? rows : null;
};
const removeTemplateExercise = async ( template_exercise_id) => {
    const [rows] = await pool.query(
        'DELETE FROM template_exercises WHERE template_exercise_id = ?',
        [template_exercise_id]
    );
    return rows.length > 0 ? rows : null;
};




module.exports = {
    removeTemplateExercise,
    updateWorkoutTemplateExercise,
    insertWorkoutTemplateExercise,
    insertGymTrainers,
    getAllTrainers,
    getGymTrainers,
    insertWorkoutTemplates,
    getGymTrainersById
};
