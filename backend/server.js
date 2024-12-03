const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const cron = require('node-cron');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors(
    {
  origin: 'https://medease-project-frontend.onrender.com', // Update with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}
));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ashritha:ashritha@cluster0.wvphu4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const medicineSchema = new mongoose.Schema({
    name: String,
    manufacturingDate: Date,
    expiryDate: Date,
    notificationTimes: [
        {
          time: String, // 'HH:MM' format
          
        }
      ],
    phoneNumber: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
});

const User= mongoose.model('User',userSchema);

// Register route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    const existingUserId = await User.findOne({ username });
    if (existingUserId) {
      return res.status(400).send('This username already exists.');
    }
    if (existingUser) {
      return res.status(400).send('User already exists.');
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password});
    await user.save();

    res.status(201).send('User registered successfully.');
  } catch (error) {
    res.status(500).send('An error occurred while registering.');
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email," ",password);

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    // Check if the password is correct
    // const isMatch = await bcrypt.compare(password, user.password);
  
    console.log("done");

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('An error occurred while logging in.');
  }
});

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer token"

  if (!token) {
      return res.status(403).send('No token provided.');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
          return res.status(403).send('Invalid or expired token.');
      }
      req.user = decoded; // Save the decoded user info in request object
      next(); // Proceed to the next middleware/route
  });
};


const Medicine = mongoose.model('Medicine', medicineSchema);



// Add medicine route (protected)
app.post('/api/medicines', verifyToken, async (req, res) => {
  try {
      // Add userId to the medicine document
      const medicine = new Medicine({
          ...req.body,
          userId: req.user.userId // Assign the logged-in user's ID
      });
      await medicine.save();
      res.status(201).send(medicine);
  } catch (error) {
      res.status(400).send(error);
  }
});

// Get medicines route (protected) - Only the logged-in user should see their medicines
app.get('/api/medicines', verifyToken, async (req, res) => {
  try {
      const medicines = await Medicine.find({ userId: req.user.userId }); // Filter medicines by userId
      res.status(200).send(medicines);
  } catch (error) {
      res.status(500).send(error);
  }
});

// Delete medicine route (protected)
app.delete('/api/medicines/:id', verifyToken, async (req, res) => {
  const medicineId = req.params.id;

  try {
    // Find the medicine and ensure it belongs to the logged-in user
    const medicine = await Medicine.findOne({ _id: medicineId, userId: req.user.userId });

    if (!medicine) {
      return res.status(404).send('Medicine not found or you do not have permission to delete it.');
    }

    // Delete the medicine
    await Medicine.deleteOne({ _id: medicineId });
    res.status(200).send('Medicine deleted successfully.');
  } catch (error) {
    res.status(500).send('An error occurred while deleting the medicine.');
  }
});


require('dotenv').config();
const accountSid = "AC8b90163c1caa2bfda7563453407c3f56";
// Import the Twilio module
const twilio = require('twilio');

// Twilio credentials
// const accountSid = 'AC8b90163c1caa2bfda7563453407c3f56'; // Replace with your Account SID
const authToken = '6ccdb9eee5ddf5ad1528dfad27df5bb5';   // Replace with your Auth Token

// Create a Twilio client
const client = twilio(accountSid, authToken);

// Define SMS details
const messageOptions = {
  body: 'This is a test SMS sent from Twilio!',
  from: '+18179853172', 
  to: '+916300727393'  
};

// Code for sending warning message to the user's phone 7 days before the expiry date
cron.schedule('0 0 * * *', async () => {
    try {
      const medicines = await Medicine.find();
      medicines.forEach(medicine => {
        if (new Date(medicine.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
          const messageOptions = {
            body: `Reminder: Your medicine ${medicine.name} is expiring soon.`,
            from: '+18179853172', // Replace with your Twilio phone number
            to: '+91'+medicine.phoneNumber // Send SMS to the user's phone number
          };
  
          client.messages.create(messageOptions)
            .then(message => {
              console.log('Message sent successfully:', message.sid);
            })
            .catch(error => {
              console.error('Error sending message:', error);
            });
        }
      });
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  });
  

// Schedule this cron job to run every minute to check for notifications every day 
cron.schedule('* * * * *', async () => {
    try {
      const medicines = await Medicine.find();
      
      const now = new Date();
  
      medicines.forEach(medicine => {
        medicine.notificationTimes.forEach(notification => {
          const [hour, minute] = notification.time.split(':');
          // console.log("hour "+hour);
          // console.log("minute "+minute);
          const period = notification.period;
  
          // Convert to 24-hour format if necessary
          const notificationHour = hour;
          // console.log("notification hour "+notificationHour);
          // console.log("now.getHour "+now.getHours());
          // console.log("now.getMinute() "+now.getMinutes());
  
          // Check if the current time matches any notification time
          if (now.getHours() === parseInt(notificationHour) && now.getMinutes() === parseInt(minute)) {
            const messageOptions = {
              body: `Reminder: It's time to take your medicine ${medicine.name}.`,
              from: '+18179853172',
              to:'+91'+medicine.phoneNumber 
            };
  
            client.messages.create(messageOptions)
              .then(message => {
                console.log('Message sent successfully:', message.sid);
              })
              .catch(error => {
                console.error('Error sending message:', error);
              });
          }
        });
      });
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  });

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
