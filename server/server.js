const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
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


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    // Create a unique file name with timestamp and original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload variable with multer configuration
const upload = multer({ storage: storage });

// Serve the files in the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Endpoint to handle file uploads
app.post('/upload', upload.fields([{ name: 'business_permit', maxCount: 1 }, { name: 'gym_logo', maxCount: 1 }]), (req, res) => {
  if (req.files) {
    // Normalize the paths by replacing backslashes with forward slashes
    Object.keys(req.files).forEach(key => {
      req.files[key].forEach(file => {
        file.path = file.path.replace(/\\/g, '/'); // Replace \ with /
      });
    });

    // Respond with JSON data containing information about the uploaded files
    res.json(req.files);
    console.log(req.files);
  } else {
    // You might want to send a proper error message or status code here
    res.status(400).json({ error: 'File upload failed' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
