const express = require('express');
const router = express.Router();
const db = require('../Database/Database');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gracevilla',
  database: 'Project',
  connectionLimit: 10
});

// Middleware to parse the request body
router.use(express.urlencoded({ extended: true }));

// Route to render the Forgot page
router.get('/forgot', (req, res) => {
  res.render('Forgot');
});

// Function to generate a random OTP
function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

// Route to handle the OTP submission
router.post('/otp', (req, res) => {
  const { email, phoneNo } = req.body;
  console.log('Submitted Email:', email);
  console.log('Submitted Phone Number:', phoneNo);
  const OTP = generateOTP(); // Generate the OTP here

  // Save the OTP to the database or any other storage mechanism
  saveOTPToDatabase(email, OTP)
    .then(() => {
      // Send the OTP to the user's email
      sendOTPEmail(email, OTP)
        .then(() => {
          req.session.email = email; // Store the email in the session
          res.render('OTP'); // Render the OTP page
        })
        .catch((error) => {
          console.error('Error sending OTP:', error);
          res.send('Failed to send OTP');
        });
    })
    .catch((error) => {
      console.error('Error saving OTP:', error);
      res.send('Failed to save OTP');
    });
});

// Function to save the OTP to the database or any other storage mechanism
function saveOTPToDatabase(email, OTP) {
  return new Promise((resolve, reject) => {
    // Implement your code to save the OTP to the database or storage mechanism

    // For example, using the `pool` connection created earlier
    pool.query('INSERT INTO OTP (email, otp) VALUES (?, ?)', [email, OTP], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Function to send the OTP to the user's email
function sendOTPEmail(email, OTP) {
  return new Promise((resolve, reject) => {
    // Create a nodemailer transporter using your email credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'care.datalabs@gmail.com',
        pass: 'brhtjewifinhsbfa'
      }
    });

    // Define the email message
    const mailOptions = {
      from: 'care.datalabs@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is: ${OTP}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = router;
