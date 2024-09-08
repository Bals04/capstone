const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()


async function getGymInfo() {
    const [rows] = await pool.query(
        `SELECT 
            g.gym_id, 
            g.gym_name, 
            g.latitude, 
            g.longtitude, 
            g.daily_rate, 
            g.monthly_rate,
            COALESCE(FORMAT(SUM(r.ratings) / COUNT(r.ratings), 2), 'no ratings yet') AS Average,
            g.contact_no, 
            g.street_address, 
            i.img_path
        FROM 
            gyms g 
        LEFT JOIN 
            gym_ratings r ON g.gym_id = r.gym_id
        LEFT JOIN 
            gym_images i ON g.gym_id = i.gym_id
        WHERE g.status = 'Approved'
        GROUP BY 
            g.gym_id, 
            g.gym_name, 
            g.latitude, 
            g.longtitude, 
            g.daily_rate, 
            g.monthly_rate, 
            g.contact_no, 
            g.street_address, 
            i.img_path;
        `
    )
    return rows
}
async function getParkInfo() {
    const [rows] = await pool.query(
        `SELECT 
            id,
            name,
            latitude,
            longitude,
            DATE_FORMAT(opens_at, '%r') AS opens_at,
            DATE_FORMAT(closes_at, '%r') AS closes_at,
            img,
            address
            FROM 
            recreational_areas;
`
    )
    return rows
}
async function getMembers() {
    const [rows] = await pool.query(`
         SELECT member_id, trainer_id,(SELECT gym_name FROM gyms WHERE gym_id = m.gym_id) AS gym,
         firstname, lastname, weight, bodytype
        FROM members m
        WHERE  trainer_id = 1`)
    return rows
}

async function getExercises() {
    const [rows] = await pool.query(`SELECT exercise_id, exercise FROM exercises;`)
    return rows
}

async function getMealInfo() {
    const [rows] = await pool.query(`SELECT * FROM meals;`)
    return rows
}

async function getStudCount() {
    const [rows] = await pool.query(`SELECT COUNT(member_id) as empCount FROM members;`)
    return rows
}
async function getTrainerCount() {
    const [rows] = await pool.query(`SELECT COUNT(trainer_id) as trainerCount FROM trainers`)
    return rows
}
async function getAllMembers() {
    const [rows] = await pool.query(`
        SELECT m.member_id, concat(m.lastname,', ',m.firstname) as member_name, mr.start_date, mr.end_date, concat(t.lastname, ',', t.firstname) AS Trainer
        FROM members m JOIN member_registration mr 
        ON m.member_id = mr.member_id
        JOIN trainers t ON m.trainer_id = t.trainer_id`)
    return rows
}

async function AddCustomWorkout(member_id, exercise_id, reps, sets, workout_date, status) {
    const result = await pool.query(`
    INSERT INTO member_workout_details (member_id, exercise_id, repititions, sets, workout_date, status)
    VALUES (?,?,?,?,?,?)
    `, [member_id, exercise_id, reps, sets, workout_date, status])

    return result
}

async function getWorkoutOftheWeek(memberId, weekNo) {
    const [rows] = await pool.query(`
    WITH CTE_WORKOUT_SCHEDULE AS (
    SELECT concat(m.lastname, ', ', m.firstname) AS Name, e.exercise, mw.repititions, mw.sets, DATE_FORMAT(mw.workout_date, '%M %e, %Y') AS formatted_workout_date,
    DATEDIFF(mw.workout_date, mr.start_date) + DAY(mr.start_date) AS Day
    FROM member_workout_details mw
    JOIN members m on mw.member_id = m.member_id
    JOIN exercises e ON mw.exercise_id = e.exercise_id
    JOIN member_registration mr ON mr.member_id = mw.member_id
    WHERE mw.member_id = ?
    ),
    CTE_WEEK AS (
        SELECT Name, Exercise,repititions,sets,Day,
        CASE 
        WHEN Day >= 1 AND Day < 7 THEN 1
        WHEN Day >= 7 AND Day < 14 THEN 2
        WHEN Day >= 14 AND Day < 21 THEN 3
        WHEN Day >= 21 AND Day < 28 THEN 4
        END AS Current_week
        FROM CTE_WORKOUT_SCHEDULE
    )
    SELECT * FROM CTE_WEEK WHERE Current_week = ?
        `, [memberId, weekNo])
    return rows
}
async function getWorkoutoftheDay(memberId, date) {
    const [rows] = await pool.query(`
    SELECT m.member_id,concat(m.lastname, ', ', m.firstname) AS member_name, e.exercise, mw.repititions, mw.sets 
    FROM member_workout_details mw
    JOIN exercises e ON mw.exercise_id = e.exercise_id
    JOIN members m ON m.member_id = mw.member_id
    where mw.member_id = ? AND workout_date = DATE_FORMAT(STR_TO_DATE(?, '%M %d, %Y'), '%Y/%c/%e')
        `, [memberId, date])
    return rows
}
async function getTemplates() {
    const [rows] = await pool.query(`SELECT * FROM workout_plan_templates`)
    return rows
}

async function AddTemplate(trainer_id, name, desc) {
    const result = await pool.query(`
    INSERT INTO workout_plan_templates (trainer_id, template_name, description)
    VALUES (?,?,?)
    `, [trainer_id, name, desc])

    return result
}

async function inputFilter(input) {
    const [result] = await pool.query(`
        SELECT * FROM gyms
        WHERE gym_name LIKE ?;
    `, [`${input}%`]);

    return [result]
}

async function RegisterGym(admin_id, gymname, latitude, longtitude, daily_rate, monthly_rate, contact_no, street_address, status) {
    const result = await pool.query(`
    INSERT INTO gyms (admin_id, gym_name, latitude, longtitude, daily_rate, monthly_rate, contact_no, street_address, status)
    VALUES (?,?,?,?,?,?,?,?,?)
    `, [admin_id, gymname, latitude, longtitude, daily_rate, monthly_rate, contact_no, street_address, status])

    return result
}

async function AddGymDocuments(document_type, document_path) {
    const result = await pool.query(`
    INSERT INTO gym_documents (gym_id, document_type, document_path) 
    VALUES ((SELECT gym_id FROM gyms ORDER BY gym_id desc LIMIT 1), ?, ?)
    `, [document_type, document_path])

    return result
}

async function AddGymLogo(img_path) {
    const result = await pool.query(`
    INSERT INTO gym_images (gym_id, img_path) 
    VALUES ((SELECT gym_id FROM gyms ORDER BY gym_id desc LIMIT 1), ?)
    `, [img_path])

    return result
}

async function query(sql, params) {
    const [results] = await pool.query(sql, params);
    return results;
}

async function getPendingGyms() {
    const [rows] = await pool.query(
        `SELECT 
            g.gym_id, 
            g.gym_name, 
            CONCAT(a.lastname, ', ', a.firstname) Owner_name,
            g.contact_no,
            a.email,
            g.street_address, 
            i.img_path,
            d.document_path
        FROM 
            gyms g 
        LEFT JOIN 
            gym_images i ON g.gym_id = i.gym_id
        LEFT JOIN 
            gym_documents d ON g.gym_id = d.gym_id
        LEFT JOIN
        	gym_admin a ON g.admin_id = a.admin_id
        WHERE g.status = 'Pending'
        GROUP BY 
            g.gym_id, 
            g.gym_name, 
            g.contact_no, 
            g.street_address,
            d.document_path,
            i.img_path;`
    )
    return rows
}

async function getPaymentPendingGyms() {
    const [rows] = await pool.query(
        `SELECT 
            g.gym_id, 
            g.gym_name, 
            CONCAT(a.lastname, ', ', a.firstname) Owner_name,
            g.contact_no,
            a.email,
            g.street_address, 
            i.img_path,
            d.document_path
        FROM 
            gyms g 
        LEFT JOIN 
            gym_images i ON g.gym_id = i.gym_id
        LEFT JOIN 
            gym_documents d ON g.gym_id = d.gym_id
        LEFT JOIN
        	gym_admin a ON g.admin_id = a.admin_id
        WHERE g.status = 'Approved - Payment Pending'
        GROUP BY 
            g.gym_id, 
            g.gym_name, 
            g.contact_no, 
            g.street_address,
            d.document_path,
            i.img_path`
    )
    return rows
}

async function ApproveRequest(gym_id) {
    const result = await pool.query(`
        UPDATE gyms
        SET status = 'Approved - Payment Pending'
        WHERE gym_id = ?;
        `, [gym_id])

    return result
}

async function AddUserToken(userID, token, expiresAt) {
    const result = await pool.query(`
    INSERT INTO userTokens (userId, token, expiresAt,) 
    VALUES (?,?,?)
    `, [userID, token, expiresAt])

    return result
}

async function GetMemberInfo(account_id) {
    const [result] = await pool.query(`
    SELECT * FROM members WHERE account_id = ?
    `, [account_id])

    return result
}

module.exports = {
    getPaymentPendingGyms,
    GetMemberInfo,
    ApproveRequest,
    getPendingGyms,
    query,
    pool,
    getGymInfo,
    getMealInfo,
    getMembers,
    getExercises,
    AddCustomWorkout,
    getStudCount,
    getTrainerCount,
    getAllMembers,
    getWorkoutOftheWeek,
    getWorkoutoftheDay,
    getParkInfo,
    getTemplates,
    AddTemplate,
    inputFilter,
    RegisterGym,
    AddGymDocuments,
    AddGymLogo
};