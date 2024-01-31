const express = require('express');
const { body, validationResult } = require('express-validator');
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

router.get('/', (req, res) => {
  res.redirect('/aboutus');
});

router.get('/login', (req, res) => {
  res.render('Login');
});

// Function to insert an audit log record
function insertAuditLog(userId, action, callback) {
  const query = "INSERT INTO Audit_Log (user_id, action, date) VALUES (?, ?, NOW())";
  const values = [userId, action];

  pool.query(query, values, (error, results) => {
    if (error) {
      console.error("Error inserting audit log record:", error);
      callback(error);
    } else {
      callback(null, results);
    }
  });
}

router.post('/login', [
  // Validate and sanitize the username and password inputs
  body('username').notEmpty().trim(),
  body('password').notEmpty().trim(),
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Handle validation errors
    return res.render('400');
  }

  const { username, password } = req.body;

  // Validate the login credentials against the Users table
  const query = `SELECT * FROM Users WHERE username = ? AND password = ?`;
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing login query:', err);
      return res.render('500');
    }

    if (results.length === 1) {
      // Successful login
      // Store user details in the session
      req.session.user = {
        username: results[0].username,
        name: results[0].name,
        role_id: results[0].role_id,
        email: results[0].email,
        phone_number: results[0].phone_number,
        profile: results[0].profile,
        user_id: results[0].user_id,
        isAdmin: results[0].role_id === "Admin",
        isLabManager: results[0].role_id === "Lab Manager",
      };

      const userId = req.session.user.user_id;

      // Insert the audit log record
      const action = `Logged in`;
      insertAuditLog(userId, action, (error, results) => {
        if (error) {
          console.error("Error inserting audit log record:", error);
          return res.render('500');
        }

        res.redirect('/dashboard/page/1');
      });

      // Console.log the user details
      console.log(req.session.user.username);
      console.log(req.session.user.role_id);
      console.log(req.session.user.email);
      console.log(req.session.user.phone_number);
      console.log(req.session.user.profile);
      console.log(req.session.user.user_id);
      console.log(req.session.user.name);
    } else {
      // Invalid login credentials
      res.render('Login', { invalidCredentials: true });
    }
  });
});

module.exports = router;
