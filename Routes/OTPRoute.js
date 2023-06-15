const express = require('express');
const router = express.Router();
const db = require('../Database/Database');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gracevilla',
  database: 'Project',
  connectionLimit: 10
});

router.get('/otp', (req, res) => {
  res.render('OTP');
});

router.get('/newpassword', (req, res) => {
  res.render('NewPassword');
});

router.post('/verify-otp', (req, res) => {
  const enteredOTP = req.body.otp;
  const email = req.session.email; // Retrieve the email from the session

  // Retrieve the stored OTP from the database
  pool.query('SELECT otp FROM OTP WHERE email = ? ORDER BY created_at DESC LIMIT 1', [email], (err, results) => {
    if (err) {
      console.error('Error retrieving stored OTP:', err);
      res.json({ result: 'failure' });
      return;
    }

    const storedOTP = results[0].otp;

    if (enteredOTP === storedOTP) {
      res.json({ result: 'success', redirect: '/newpassword' }); // Return success and redirect URL
    } else {
      res.json({ result: 'failure' });
    }
  });
});

module.exports = router;
