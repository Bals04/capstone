const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const gymroutes = require('./routes/gymRoutes');
const trainerroutes = require('./routes/trainerroutes');
const memberRoutes = require('./routes/memberRoutes');
const parkRoutes = require('./routes/parkRoute');
const uploadRoutes = require('./routes/uploadRoutes'); // Import upload routes
const AuthRoutes = require('./routes/AuthRoutes'); // Import upload routes
const cookieParser = require("cookie-parser")

const app = express();
dotenv.config();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(cors());
const PORT = process.env.PORT || 3000;


// Use the routes in the routes folder
app.use('/', gymroutes);
app.use('/', trainerroutes);
app.use('/', memberRoutes);
app.use('/', parkRoutes);
app.use('/', uploadRoutes);
app.use('/auth', AuthRoutes);

//? NAVIGATION
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/scripts')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/maps/index.html'));
});

// Serve the files in the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
