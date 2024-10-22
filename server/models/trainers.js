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
        'SELECT t.trainer_id, t.gym_id, t.account_id, t.firstname, t.lastname, t.bio, t.experience, t.rates, t.trainer_type, i.filename FROM trainers t JOIN trainer_images i ON t.trainer_id = i.trainer_id WHERE t.gym_id =  ?',
        [gym_id]
    );
    return rows.length > 0 ? rows : null;
};
const getGymTrainersById = async (trainer_id) => {
    const [rows] = await pool.query(
        'SELECT t.trainer_id, t.gym_id, t.account_id, t.firstname, t.lastname, t.bio, t.experience, t.rates, t.trainer_type, i.filename FROM trainers t JOIN trainer_images i ON t.trainer_id = i.trainer_id  WHERE t.trainer_id = ?',
        [trainer_id]
    );
    return rows.length > 0 ? rows : null;
};
const insertGymTrainers = async (gymid, userid, firstname, lastname, bio, experience, rates, trainerType) => {
    const [rows] = await pool.query(
        'INSERT INTO trainers (gym_id, account_id, firstname, lastname, bio, experience, rates, trainer_type) VALUES(?,(SELECT account_id FROM user_accounts ORDER BY account_id desc LIMIT 1),?,?,?,?,?,?)',
        [gymid, userid, firstname, lastname, bio, experience, rates, trainerType]
    );
    console.log("Inserted ID:", rows.insertId);

    // Return only the insertId
    return rows.insertId;  // This will return the auto-incremented ID
};
const insertWorkoutTemplates = async (trainer_id, template_name, description) => {
    const [rows] = await pool.query(
        'INSERT INTO workout_plan_templates (trainer_id, template_name, description) VALUES(?,?,?)',
        [trainer_id, template_name, description]
    );
    return rows.length > 0 ? rows : null;
};
const insertWorkoutTemplateExercise = async (template_id, exercise_id, exercise_name, reps, sets, muscle_group, secondaryMuscle, week_no, day_no) => {
    const [rows] = await pool.query(
        'INSERT INTO template_exercises (template_id, exercise_id, exercise_name, repetitions, sets, target_muscle_group, secondaryMuscles, week_no, day_no) VALUES(?,?,?,?,?,?,?,?,?)',
        [template_id, exercise_id, exercise_name, reps, sets, muscle_group, secondaryMuscle, week_no, day_no]
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
const removeTemplateExercise = async (template_exercise_id) => {
    const [rows] = await pool.query(
        'DELETE FROM template_exercises WHERE template_exercise_id = ?',
        [template_exercise_id]
    );
    return rows.length > 0 ? rows : null;
};
async function inputFilter(input, trainer_id) {
    const [result] = await pool.query(`
        SELECT * FROM workout_plan_templates
        WHERE template_name LIKE ?
        AND trainer_id = ?
    `, [`${input}%`, trainer_id]);

    return [result]
};

const insertMealTemplates = async (trainer_id, template_name, description) => {
    const [rows] = await pool.query(
        'INSERT INTO meal_plan_templates (trainer_id, template_name, description) VALUES(?,?,?)',
        [trainer_id, template_name, description]
    );
    // Return only the insertId
    return rows.insertId;
};
const insertMealTemplatesItems = async (meal_template_id, meal_name, classification, protein, carbohydrates, fats, week_no, day_no) => {
    const [result] = await pool.query(
        'INSERT INTO meal_template_items (meal_template_id, meal_name, classification, protein, carbohydrates, fats, week_no, day_no) VALUES(?,?,?,?,?,?,?,?)',
        [meal_template_id, meal_name, classification, protein, carbohydrates, fats, week_no, day_no]
    );

    // Log the insertId to confirm
    console.log("Inserted ID:", result.insertId);

    // Return only the insertId
    return result.insertId;  // This will return the auto-incremented ID
};

const insertMealTemplatesSteps = async (template_item_id, step_number, instruction) => {
    const [rows] = await pool.query(
        'INSERT INTO meal_item_steps (template_item_id, step_number, instruction) VALUES(?,?,?)',
        [template_item_id, step_number, instruction]
    );
    return rows.length > 0 ? rows : null;
};
const insertProposal = async (trainer_id, member_id, planType, price, duration, status) => {
    const [rows] = await pool.query(
        'INSERT INTO proposals (trainer_id, member_id, plan_type, price, duration, status) VALUES(?,?,?,?,?,?)',
        [trainer_id, member_id, planType, price, duration, status]
    );
    // Return only the insertId
    return rows.insertId;
};
const insertNotification = async (member_id, proposal_id, message) => {
    const [rows] = await pool.query(
        'INSERT INTO notifications (member_id, proposal_id, message) VALUES(?,?,?)',
        [member_id, proposal_id, message]
    );
    // Return only the insertId
    return rows.insertId;
};

const getStudents = async (trainer_id) => {
    const [rows] = await pool.query(
       `SELECT
        m.member_id, 
        CONCAT(m.lastname, ',', m.firstname) AS Name,
        p.plan_type, 
        mp.amount AS amount_paid,
        DATE(c.start_date) AS start_date, 
        DATE(c.end_date) AS end_date,  
        DATEDIFF(c.end_date, NOW()) AS days_remaining,
        COALESCE(mw.status, "Not assigned yet") AS status
        FROM 
            members m
        LEFT JOIN 
            proposals p ON m.member_id = p.member_id
        LEFT JOIN 
            contracts_table c ON c.proposal_id = p.proposal_id
        LEFT JOIN 
            member_payments mp ON mp.contract_id = c.contract_id
        LEFT JOIN
        	member_workout_plan mw ON mw.member_id = p.member_id
        WHERE 
            c.status = 'On going' AND p.trainer_id = ?`,
        [trainer_id]
    );
    return rows.length > 0 ? rows : null;
};
const getStudentActivity = async (trainer_id) => {
    const [rows] = await pool.query(
       `SELECT 
            s.member_id, 
            s.trainer_id, 
            (SELECT CONCAT(firstname, ' ', lastname) 
            FROM members 
            WHERE s.member_id = member_id) AS name,
            s.message, 
            s.date 
        FROM 
            student_activity s 
        WHERE 
            trainer_id = ?
            AND DATE(s.date) = CURDATE();
`,
        [trainer_id]
    );
    return rows.length > 0 ? rows : null;
};
const assignWorkoutPlan = async (trainer_id, member_id, template_id, status) => {
    const [rows] = await pool.query(
        'INSERT INTO member_workout_plan (trainer_id, member_id, template_id, status) VALUES(?,?,?,?)',
        [trainer_id, member_id, template_id, status]
    );
    // Return only the insertId
    return rows.insertId;
};
const insertStudentWorkouts = async (plan_id, template_id) => {
    const [rows] = await pool.query(
       `INSERT INTO member_workout_plan_status (plan_id, template_exercise_id, status)
        SELECT ?, template_exercise_id, 'not started'
        FROM template_exercises
        WHERE template_id = ?`,
        [plan_id, template_id]
    );
    // Return only the insertId
    return rows.insertId;
};
const getProgressOftheDay = async (trainer_id) => {
    const [rows] = await pool.query(
       `WITH CTE_CURRENT_DAY AS (
        SELECT 
            m.member_id,
            template_id,
            m.date_started,
            CASE 
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 1 AND DATEDIFF(CURRENT_DATE, m.date_started) < 7 THEN 1
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 7 AND DATEDIFF(CURRENT_DATE, m.date_started) < 14 THEN 2
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 14 AND DATEDIFF(CURRENT_DATE, m.date_started) < 21 THEN 3
                WHEN DATEDIFF(CURRENT_DATE, m.date_started) + 1 >= 21 AND DATEDIFF(CURRENT_DATE, m.date_started) < 28 THEN 4
                ELSE 0
            END AS Week_Number,
            -- Reset Day_number to always be between 1 and 7
            MOD(DATEDIFF(CURRENT_DATE, m.date_started), 7) + 1 AS Day_number
        FROM 
            member_workout_plan m
        WHERE m.trainer_id = 6
    ),
    CTE_WORKOUT AS (
        SELECT 
            me.member_id,
            (SELECT CONCAT(lastname, ', ', firstname) FROM members WHERE member_id = me.member_id) AS member_name,
            mes.status,
            wte.week_no,
            wte.day_no,
            c.Week_Number,
            c.Day_number
        FROM 
            member_workout_plan_status mes
        JOIN 
            template_exercises wte ON mes.template_exercise_id = wte.template_exercise_id
        JOIN 
            member_workout_plan me ON me.plan_id = mes.plan_id
        JOIN 
            CTE_CURRENT_DAY c ON c.template_id = wte.template_id
        WHERE 
            c.Day_number = wte.day_no
        AND
            c.Week_Number = wte.week_no
    )
    SELECT 
        member_id,
        member_name,
        COUNT(*) AS total_workouts,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS finished_workouts
    FROM 
        CTE_WORKOUT
    GROUP BY 
        member_name;

        `,
        [trainer_id]
    );
    return rows.length > 0 ? [rows] : null;
};


module.exports = {
    getStudentActivity,
    getProgressOftheDay,
    insertStudentWorkouts,
    assignWorkoutPlan,
    getStudents,
    insertNotification,
    insertProposal,
    insertMealTemplatesSteps,
    insertMealTemplatesItems,
    insertMealTemplates,
    inputFilter,
    removeTemplateExercise,
    updateWorkoutTemplateExercise,
    insertWorkoutTemplateExercise,
    insertGymTrainers,
    getAllTrainers,
    getGymTrainers,
    insertWorkoutTemplates,
    getGymTrainersById
};
