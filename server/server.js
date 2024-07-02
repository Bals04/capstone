const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const gymroutes = require('./routes/gymRoutes');
const trainerroutes = require('./routes/trainerroutes');

dotenv.config();

const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
const PORT = process.env.PORT || 3000;

app.use(cors());
//use the routes in the routes folder
app.use('/', gymroutes);
app.use('/', trainerroutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
