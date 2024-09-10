const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const gymroutes = require('./routes/gymRoutes');
const trainerroutes = require('./routes/trainerroutes');
const memberRoutes = require('./routes/memberRoutes');
const parkRoutes = require('./routes/parkRoute');
const gymAdminRoutes = require('./routes/gymAdminRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // Import upload routes
const AuthRoutes = require('./routes/AuthRoutes'); // Import upload routes
//const NavRoutes = require('./routes/NavigationRoutes'); // Import upload routes
const cookieParser = require("cookie-parser")
const paypal = require('./services/paypal')
const NavRoutes = require('./routes/navRoutes'); // Import upload routes
const paymentRoute = require('./routes/paymentRoute');

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
app.use('/', gymAdminRoutes);
app.use('/', NavRoutes);
app.use('/', paymentRoute);
app.use('/auth', AuthRoutes);

//? NAVIGATION
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/scripts')));
app.use(express.urlencoded({ extended: true })); // To handle form data

// Serve the files in the 'uploads' directory
app.use('/uploads', express.static('uploads'));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});