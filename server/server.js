const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const gymroutes = require('./routes/gymRoutes');
const trainerroutes = require('./routes/trainerroutes');
const memberRoutes = require('./routes/memberRoutes');
const parkRoutes = require('./routes/parkRoute');
const gymAdminRoutes = require('./routes/gymAdminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const NavRoutes = require('./routes/navRoutes');
const paymentRoute = require('./routes/paymentRoute');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://127.0.0.1:5500', // Replace with your frontend's actual origin
  credentials: true
}));


const PORT = process.env.PORT || 3000;

// MySQL connection options for the session store
const sessionStore = new MySQLStore({
  host: process.env.MYSQL_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000 // 1 day
});

// Express session configuration using the same MySQL database as your gym app
app.use(session({
  key: 'session_cookie_name',
  secret: 'your-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: 'Lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


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

// Serve frontend files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/scripts')));
app.use(express.urlencoded({ extended: true }));

// Serve the files in the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
