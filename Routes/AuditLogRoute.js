const express = require("express");
const router = express.Router();
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

// Define isAdmin middleware
const isAdmin = (req, res, next) => {
  req.isAdmin = req.session.user.role_id === "Admin";
  next();
};

// Define isLabManager middleware
const isLabManager = (req, res, next) => {
  req.isLabManager = req.session.user.role_id === "Lab Manager";
  next();
};

// Retrieve the audit log data from the database
const getAuditLogData = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT Audit_Log.*, Users.name AS user, Audit_Log.action FROM Audit_Log INNER JOIN Users ON Audit_Log.user_id = Users.user_id ORDER BY Audit_Log.date DESC";

    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

router.get("/auditlog", authenticateUser, isLabManager, isAdmin, async (req, res) => {
  try {
    // Retrieve the audit log data
    const auditLogData = await getAuditLogData();

    // Render the 'AuditLog' view and pass the audit log data
    res.render('AuditLog', { auditLogData, currentUser: req.session.user.name, isLabManager: req.isLabManager, isAdmin: req.isAdmin });
  } catch (error) {
    console.error("Error retrieving audit log data:", error);
    res.status(500).send("Internal Server Error");
  }
});

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
