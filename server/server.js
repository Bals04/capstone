const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const gymroutes = require('./routes/gymRoutes');
const trainerroutes = require('./routes/trainerroutes');
const memberRoutes = require('./routes/memberRoutes');
const parkRoutes = require('./routes/parkRoute');
const uploadRoutes = require('./routes/uploadRoutes'); // Import upload routes
const bcrypt = require('bcrypt');
const users = require('./models/users');  // Import the users model
const cookieParser = require("cookie-parser")
const { createTokens, validateToken } = require('./middlewares/JWT')

dotenv.config();
const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
const PORT = process.env.PORT || 3000;

app.use(cors());

// Use the routes in the routes folder
app.use('/', gymroutes);
app.use('/', trainerroutes);
app.use('/', memberRoutes);
app.use('/', parkRoutes);
app.use('/', uploadRoutes);

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
