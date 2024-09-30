const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()
// Log the credentials without the password
console.log('Database connection details:');
console.log(`Host: ${process.env.MYSQL_HOST}`);
console.log(`User: ${process.env.MYSQL_USER}`);
console.log(`Database: ${process.env.MYSQL_DATABASE}`);

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
        WHERE g.status = 'Verified'
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

async function getWorkoutOftheWeek(memberId) {
    const [rows] = await pool.query(`
        WITH CTE_CURRENT_WEEK AS (
            SELECT 
                template_id, (SELECT CONCAT(lastname, ', ', firstname) FROM members WHERE member_id = ?) AS Name,
                m.date_started, 
                CASE 
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) >= 1 AND DATEDIFF(CURRENT_DATE, m.date_started) < 7 THEN 1
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) >= 7 AND DATEDIFF(CURRENT_DATE, m.date_started) < 14 THEN 2
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) >= 14 AND DATEDIFF(CURRENT_DATE, m.date_started) < 21 THEN 3
                    WHEN DATEDIFF(CURRENT_DATE, m.date_started) >= 21 AND DATEDIFF(CURRENT_DATE, m.date_started) < 28 THEN 4
                    ELSE 0
                END AS Week_Number,
                DATEDIFF(CURRENT_DATE, m.date_started) AS day_number
            FROM 
                member_workout_plan m
        ),

        CTE_WORKOUT AS (
            SELECT c.template_id, c.Name, t.exercise_name,
            t.repetitions, t.sets, t.week_no, t.day_no, c.Week_number, c.day_number
            FROM CTE_CURRENT_WEEK c
            LEFT JOIN template_exercises t 
            ON t.template_id = c.template_id
            WHERE t.week_no = c.Week_number AND t.day_no = c.day_number AND c.member_id
        )
        SELECT * FROM CTE_WORKOUT;`,
        [memberId, memberId])
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
async function getTemplates(trainer_id, table) {
    const allowedTables = ['workout_plan_templates', 'meal_plan_templates']; // Add other table names if needed
    if (!allowedTables.includes(table)) {
        throw new Error(`Invalid table name: ${table}`);
    }

    const query = `
        SELECT * FROM \`${table}\`
        WHERE trainer_id = ?
    `;
    const [rows] = await pool.query(query, [trainer_id]);
    return rows;
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
    INSERT INTO gym_documents (gym_id, document_type, document_path, submitted_at) 
    VALUES ((SELECT gym_id FROM gyms ORDER BY gym_id desc LIMIT 1), ?, ?, NOW())
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

async function getPendingGymsByID(admin_id) {
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
        WHERE g.status = 'Pending' AND
        a.admin_id = ?
        GROUP BY 
            g.gym_id, 
            g.gym_name, 
            g.contact_no, 
            g.street_address,
            d.document_path,
            i.img_path;`,
        [admin_id]
    )
    return rows
}

async function getPaymentPendingGyms(admin_id) {
    const [rows] = await pool.query(
        `SELECT 
            g.gym_id,
            a.admin_id,
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
        AND
        a.admin_id = ?
        GROUP BY 
        	a.admin_id,
            g.gym_id, 
            g.gym_name, 
            g.contact_no, 
            g.street_address,
            d.document_path,
            i.img_path`,
        [admin_id]
    )
    return rows
}

async function getVerifiedGyms(admin_id) {
    const [rows] = await pool.query(
        `SELECT 
            g.gym_id,
            a.admin_id,
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
        WHERE g.status = 'Verified'
        AND
        a.admin_id = ?
        GROUP BY 
        	a.admin_id,
            g.gym_id, 
            g.gym_name, 
            g.contact_no, 
            g.street_address,
            d.document_path,
            i.img_path`,
        [admin_id]
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

async function verifyGymInDb(gym_id) {
    const result = await pool.query(`
        UPDATE gyms
        SET status = 'Verified'
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

async function GetTrainerInfo(user_id) {
    console.log("res:", user_id)
    const [result] = await pool.query(`
    SELECT * FROM trainers WHERE account_id = ?
    `, [user_id])

    return result
}
async function GetGymData(gym_id) {
    const [result] = await pool.query(`
    SELECT g.gym_name, g.daily_rate, g.monthly_rate, g.contact_no, g.street_address, i.img_path
    FROM gyms g
    INNER JOIN gym_images i ON g.gym_id = i.gym_id
    WHERE g.gym_id = ?
    `, [gym_id])

    return result
}
async function GetGymAdminInfo(account_id) {
    const [result] = await pool.query(`
    SELECT * FROM gym_admin WHERE account_id = ?
    `, [account_id])

    return result
}

async function addPaymentRecord(admin_id, gym_id, subscription_id, amount, payment_status) {
    const [result] = await pool.query(`
        INSERT INTO payments_table (admin_id, gym_id, subscription_id, amount, payment_status) 
        VALUES (?,?,?,?,?)
        `, [admin_id, gym_id, subscription_id, amount, payment_status]);

    console.log("DB Query Result:", result); // Log result here
    return result; // Return only the result object
}

async function addSubscriptionRecord(admin_id, gym_id, subscription_id, days) {
    console.log("Received days value:", days); // Log the raw days value

    // Convert days to a number and check validity
    const daysNumber = Number(days);
    console.log("Converted days value:", daysNumber); // Log the converted days value
    if (isNaN(daysNumber) || daysNumber <= 0) {
        throw new Error('Invalid days value');
    }

    // Calculate the end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysNumber);

    // Format endDate to 'YYYY-MM-DD'
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const [result] = await pool.query(`
        INSERT INTO admin_subscription (admin_id, gym_id, subscription_id, start_date, end_date)
        VALUES (?, ?, ?, NOW(), ?)
        `, [admin_id, gym_id, subscription_id, formattedEndDate]);

    return result;
}

async function retrieveMemberChatLog(trainer_id) {
    const [result] = await pool.query(`
        SELECT c.id, CONCAT(m.lastname,', ',m.firstname) AS member_name, c.member_id
        FROM conversation_tbl c
        INNER JOIN members m ON c.member_id = m.member_id
        WHERE trainer_id = ?
    `, [trainer_id])

    return result
}

async function retrieveTrainerchatLog(member_id) {
    const [result] = await pool.query(`
        SELECT c.id, CONCAT(m.lastname,', ',m.firstname) AS trainer_name, c.trainer_id
        FROM conversation_tbl c
        INNER JOIN trainers m ON c.trainer_id = m.trainer_id
        WHERE member_id = ?
    `, [member_id])

    return result
}

async function getGymsByID(admin_id) {
    const [result] = await pool.query(`
        SELECT gym_id, gym_name, status FROM gyms
        WHERE admin_id = ?
        AND status = 'verified'
    `, [admin_id])

    return result
}

async function getTemplateId(template_name, table) {
    // Define a whitelist of allowed table names (to prevent SQL injection)
    const allowedTables = ['workout_plan_templates', 'meal_plan_templates']; // Add other table names if needed

    if (!allowedTables.includes(table)) {
        throw new Error(`Invalid table name: ${table}`);
    }

    const query = `
        SELECT * FROM \`${table}\`
        WHERE template_name = ?
    `;

    const [result] = await pool.query(query, [template_name]);
    return result;
}



module.exports = {
    getTemplateId,
    getGymsByID,
    retrieveTrainerchatLog,
    retrieveMemberChatLog,
    GetGymData,
    GetTrainerInfo,
    addSubscriptionRecord,
    getVerifiedGyms,
    verifyGymInDb,
    addPaymentRecord,
    getPendingGymsByID,
    GetGymAdminInfo,
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