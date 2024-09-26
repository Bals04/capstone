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
const users = {}; // e.g., { userId: socketId }

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Event for when a user logs in or identifies themselves
  socket.on("user_connected", (userId) => {
    users[userId] = socket.id; // Store the userId and socketId
    console.log(`User with ID ${userId} is connected and mapped to socket ${socket.id}`);
    console.log(users)
  });

  // Event for sending a message
  socket.on("send_message", (data) => {
    const { recipientId, message } = data;  // Assume data includes recipientId and message
    const recipientSocketId = users[recipientId];  // Look up the recipient's socket ID

    if (recipientSocketId) {
      // Send the message directly to the recipient's socket
      io.to(recipientSocketId).emit("receive_message", {
        message: message,
        fromUserId: socket.id,  // You can also add userId if needed
      });
      console.log(`Message sent to user ${recipientId}`);
    } else {
      console.log(`Recipient ${recipientId} is not connected.`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Find and remove the disconnected user's socketId
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
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
