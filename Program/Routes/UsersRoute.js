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

const isLabManager = (req, res, next) => {
  req.isLabManager = req.session.user.role_id === "Lab Manager";
  next();
};

router.get("/users", authenticateUser, isAdmin, isLabManager, async (req, res) => {
  try {
    // Retrieve user data from the database
    const [users] = await pool.promise().query('SELECT * FROM Users');

    res.render('Users', {
      isLabManager: req.isLabManager,
      isAdmin: req.isAdmin,
      users: users
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.render('500');
  }
});

router.post("/add-user", authenticateUser, isAdmin, async (req, res) => {
  try {
    const { username, name, email, category, phone_number, password } = req.body;

    // Check if the username already exists
    const [existingUsername] = await pool.promise().query('SELECT * FROM Users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return res.render('400');
    }

    // Insert the new user into the database
    await pool.promise().query(
      'INSERT INTO Users (username, name, email, role_id, phone_number, password) VALUES (?, ?, ?, ?, ?, ?)',
      [username, name, email, category, phone_number, password]
    );

    res.redirect("/users")
  } catch (error) {
    console.error('Error adding user:', error);
    res.render('500');
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

router.get("/user-details/:userId", authenticateUser, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    // Retrieve user details based on the provided userId
    const [user] = await pool
      .promise()
      .query("SELECT * FROM Users WHERE user_id = ?", [userId]);

    if (!user || user.length === 0) {
      res.status(400).render('400');
    } else {
      res.json(user[0]); // Respond with the user data as JSON
    }
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).render('500');
  }  
});

router.post("/update-user/:userId", authenticateUser, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, category, phone_number, password } = req.body;

    // Update the user details in the database
    await pool.promise().query(
      'UPDATE Users SET username = ?, email = ?, role_id = ?, phone_number = ?, password = ? WHERE user_id = ?',
      [username, email, category, phone_number, password, userId]
    );

    res.redirect("/users");
  } catch (error) {
    console.error('Error updating user:', error);
    res.render('500');
  }
});

router.delete("/delete-user/:userId", authenticateUser, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the user from the database
    await pool.promise().query('DELETE FROM Users WHERE user_id = ?', [userId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
});

module.exports = router;
