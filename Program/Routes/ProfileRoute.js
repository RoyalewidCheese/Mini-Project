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

router.get('/profile', authenticateUser, (req, res) => {
  const { name, username, role_id, email, phone_number, profile } = req.session.user;
  const isAdmin = role_id === 'Admin';
  const isLabManager = role_id === "Lab Manager";

  res.render('Profile', {
    user: req.session.user,
    name,
    username,
    role_id,
    email,
    phone_number,
    profile,
    isAdmin,
    isLabManager
  });
});

// Route to render the edit profile picture page
router.get("/editProfilePicture", authenticateUser, (req, res) => {
  res.render("EditProfilePicture");
});

// Route to handle profile picture update
router.post("/updateProfilePicture", authenticateUser, (req, res) => {
  const userId = req.session.user.user_id;
  const profilePictureData = req.body.profilePictureData; // Assuming you're sending the profile picture data in the request body

  console.log("Calling updateProfilePicture function"); // Add this line

  // Call the updateProfilePicture function from the database module
  database.updateProfilePicture(userId, profilePictureData, (error, results) => {
    if (error) {
      console.error("Error updating profile picture:", error);
      // Handle the error, e.g., show an error message to the user
      res.redirect("/profile");
    } else {
      console.log("Profile picture updated successfully"); // Add this line
      // Profile picture updated successfully
      // Redirect to the profile page or show a success message
      res.redirect("/profile");
    }
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
