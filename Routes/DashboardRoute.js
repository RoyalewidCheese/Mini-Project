const express = require("express");
const router = express.Router();
const database = require("../Database/Database");

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

// <-------------------------------------------Pagination and Viewing------------------------------------------------------->

router.get("/dashboard", authenticateUser, (req, res) => {
  res.redirect("/dashboard/page/1");
});

router.get("/dashboard/page/:page", authenticateUser, (req, res) => {
  const page = parseInt(req.params.page, 10);
  const limit = 8; // Number of items per page
  const offset = (page - 1) * limit;

  database.getItem(limit, offset, (err, results) => {
    if (err) {
      console.error("Error executing the query:", err);
      res.render("500");
      return;
    }

    const items = results.map((item) => ({
      Category: item.Category,
      Brand: item.Brand,
      Model: item.Model,
      LabLocation: item.LabLocation,
      Warranty: item.Warranty,
      Status: item.Status,
    }));

    res.render("dashboard", {
      items: items,
      limit: limit,
      currentPage: page,
      isAdmin: req.session.user.role_id === "Admin",
      isLabManager: req.session.user.role_id === "Lab Manager",
    });
  });
});

// <------------------------------------------------------------------------------------------------------------------------>

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
