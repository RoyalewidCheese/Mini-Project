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

// Middleware to parse the request body
router.use(express.urlencoded({ extended: true }));

// Route to render the New Password form
router.get('/newpassword', (req, res) => {
  res.render('NewPassword');
});

// Route to handle the password change
router.post('/change-password', (req, res) => {
  const email = req.session.email; // Retrieve the email from the session
  const newPassword = req.body.password;

  // Update the password for the email in the database
  pool.query('UPDATE Users SET password = ? WHERE email = ?', [newPassword, email], (err, results) => {
    if (err) {
      console.error('Error updating password:', err);
      res.send('Failed to update password');
    } else {
      // Terminate the session and remove the email from the session
      req.session.destroy();
      res.redirect('/login');
    }
  });
});

module.exports = router;
