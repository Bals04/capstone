const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const gymroutes = require('./routes/gymRoutes');
const trainerroutes = require('./routes/trainerroutes');
const memberRoutes = require('./routes/memberRoutes');
const parkRoutes = require('./routes/parkRoute');

dotenv.config();
const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
const PORT = process.env.PORT || 3000;

app.use(cors());
//use the routes in the routes folder
app.use('/', gymroutes);
app.use('/', trainerroutes);
app.use('/', memberRoutes);
app.use('/', parkRoutes);


//? NAVIGATION
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/scripts')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/maps/index.html'));
});
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/views/features/member.html'));
// });
// app.get('/mealsPage', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/views/features/meals.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
