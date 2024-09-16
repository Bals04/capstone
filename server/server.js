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
const messageRoute = require('./routes/messageRoutes');
const trainerRoute = require('./routes/trainerroutes');
const paymentRoute = require('./routes/paymentRoute');
const session = require('express-session'); // No need to require MySQLStore anymore
const http = require('http');
const { Server } = require ("socket.io")


const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("send_message", (data) => {
      socket.broadcast.emit("receive_message", data);
  });
});


// CORS configuration
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Replace with your frontend's actual origin
  credentials: true // Allow sending of cookies from frontend
}));

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
app.use('/', messageRoute);
app.use('/', trainerRoute);
app.use('/auth', AuthRoutes);

// Serve frontend files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/scripts')));
app.use(express.urlencoded({ extended: true }));

// Serve the files in the 'uploads' directory
app.use('/uploads', express.static('uploads'));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
