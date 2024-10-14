const db = require('./database');
const { pool } = require('./database');

const getNotifications = async (member_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM notifications WHERE member_id = ? ORDER BY created_at DESC',
        [member_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const getPlan = async (member_id) => {
    const [rows] = await pool.query(
        'SELECT plan_id FROM member_workout_plan WHERE member_id = ?',
        [member_id]
    );
    return rows.length > 0 ? rows : null;
};
const getProposals = async (member_id, proposal_id) => {
    const [rows] = await pool.query(
        'SELECT * FROM proposals WHERE member_id = ? AND proposal_id = ?',
        [member_id, proposal_id]
    );
    return rows.length > 0 ? [rows] : null;
};
const getWorkoutoftheDay = async (plan_id) => {
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
        ),
        CTE_WORKOUT AS (
            SELECT 
                me.member_id,
                (SELECT CONCAT(lastname, ', ', firstname) FROM members WHERE member_id = me.member_id) AS member_name,
                mes.status_id,
                mes.plan_id,
                wte.exercise_id,
                wte.exercise_name,
                wte.repetitions,
                wte.sets,
                wte.week_no,
                wte.day_no,
                mes.status,
                me.date_started,
                mes.updated_at
            FROM 
                member_workout_plan_status mes
            JOIN 
                template_exercises wte ON mes.template_exercise_id = wte.template_exercise_id
            JOIN 
                member_workout_plan me ON me.plan_id = mes.plan_id
            JOIN 
                CTE_CURRENT_DAY c ON c.template_id = wte.template_id	
            WHERE 
                mes.plan_id = ?
            AND 
                c.Day_number = wte.day_no
            AND
                c.Week_Number = wte.week_no
        )
        SELECT * FROM CTE_WORKOUT;
        `,
        [plan_id]
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

const updateExerciseStatus = async (status, status_id) => {
    const [rows] = await pool.query(
        'UPDATE member_workout_plan_status SET status = ? WHERE status_id = ?;',
        [status, status_id]
    );
    return rows.length > 0 ? rows : null;
};


module.exports = {
    updateExerciseStatus,
    getPlan,
    getWorkoutoftheDay,
    getNotifications,
    getProposals,
    insertContract
};
