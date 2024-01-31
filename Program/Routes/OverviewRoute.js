const express = require('express');
const router = express.Router();
const db = require('../Database/Database');

// Authentication middleware
const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect('/login');
  }
};
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gracevilla',
  database: 'Project',
  connectionLimit: 10
});

function getConnection(callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      callback(err, null);
    } else {
      callback(null, connection);
    }
  });
}

// Endpoint for fetching data for the first pie chart
router.get('/api/getStatusData', authenticateUser, (req, res) => {
  getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).json({ error: 'Error getting database connection' });
      return;
    }

    const query = 'SELECT item_status, COUNT(*) AS count FROM Items GROUP BY item_status';
    connection.query(query, (error, results) => {
      connection.release(); // Release the database connection

      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }

      const data = results.map(row => ({
        label: row.item_status,
        value: row.count
      }));

      res.json(data);
    });
  });
});

// Endpoint for fetching data for the second pie chart
router.get('/api/getItemStatusData', authenticateUser, (req, res) => {
  getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).json({ error: 'Error getting database connection' });
      return;
    }

    const query = 'SELECT lab_location, COUNT(*) AS count FROM Items GROUP BY lab_location';
    connection.query(query, (error, results) => {
      connection.release(); // Release the database connection

      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }

      const data = results.map(row => ({
        label: row.lab_location,
        value: row.count
      }));

      res.json(data);
    });
  });
});

router.get('/overview', authenticateUser, (req, res) => {
  res.render('Overview', {
    isAdmin: req.session.user.role_id === 'Admin',
    isLabManager: req.session.user.role_id === "Lab Manager",
  });
});

// <------------------------------------------------------------------------------------------------------------------------->

// Logout route
router.get("/logout", (req, res) => {
  // Terminate the user's authentication by destroying the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    // Redirect the user to the login page
    res.redirect("/login");
  });
});

module.exports = router;
