const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require("socket.io");

// Import routes from the routes folder
const gymroutes = require('./routes/gymRoutes');
const trainerroutes = require('./routes/trainerroutes');
const memberRoutes = require('./routes/memberRoutes');
const parkRoutes = require('./routes/parkRoute');
const gymAdminRoutes = require('./routes/gymAdminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const NavRoutes = require('./routes/navRoutes');
const messageRoute = require('./routes/messageRoutes');
const paymentRoute = require('./routes/paymentRoute');
const workoutRoute = require('./routes/workoutRoutes');

// Initialize environment variables (.env file)
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Setup middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Replace with your frontend's actual origin
  credentials: true // Allow sending of cookies from frontend
}));

// Initialize HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});

// Route declarations
const initializeRoutes = () => {
  console.log('Initializing routes...');
  app.use('/auth', AuthRoutes);
  app.use('/', gymroutes); // More explicit route paths
  app.use('/', trainerroutes);
  app.use('/', memberRoutes);
  app.use('/', parkRoutes);
  app.use('/', uploadRoutes);
  app.use('/', gymAdminRoutes);
  app.use('/', NavRoutes);
  app.use('/', messageRoute);
  app.use('/', paymentRoute);
  app.use('/', workoutRoute);

  // Static file serving
  app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
  app.use(express.static(path.join(__dirname, '../frontend/scripts')));
  console.log('Routes initialized successfully');

};

// Server start function
const startServer = () => {
  console.log('Starting the backend server...');

  // Initialize routes
  initializeRoutes();

  // Start the server
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// Start the server
startServer();
