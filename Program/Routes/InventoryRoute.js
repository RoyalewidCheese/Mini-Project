const express = require("express");
const router = express.Router();
const database = require("../Database/Database");

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gracevilla',
  database: 'Project',
  connectionLimit: 10
});

// Authentication middleware
const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect("/login");
  }
};

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

router.get("/inventory", authenticateUser, (req, res) => {
  res.render("Inventory", {
  isAdmin: req.session.user.role_id === "Admin",
  isLabManager: req.session.user.role_id === "Lab Manager"
  });
}); 

module.exports = router;
