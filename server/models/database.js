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
        `SELECT g.gym_id, g.gym_name, g.latitude, g.longtitude, g.daily_rate, g.monthly_rate, g.img,
         COALESCE(FORMAT(SUM(r.ratings) / COUNT(r.ratings), 2), "no ratings yet") AS Average 
         FROM gyms g LEFT JOIN gym_ratings r 
         ON g.gym_id = r.gym_id
         GROUP BY g.gym_id, g.latitude, g.longtitude, g.daily_rate, g.monthly_rate, g.img;`
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

async function AddCustomWorkout(member_id,exercise_id,reps,sets,week_no,day_no,status) {
    const result = await pool.query(`
    INSERT INTO member_workout_details (member_id, exercise_id, repititions, sets, week_no, day_no, status)
    VALUES (?,?,?,?,?,?,?)
    `, [member_id,exercise_id,reps,sets,week_no,day_no,status])

    return result
}


module.exports = {
    getGymInfo,
    getMealInfo,
    getMembers,
    getExercises,
    AddCustomWorkout
};