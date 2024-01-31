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

function deleteBorrowerByStudentName(studentName, callback) {
  const query = "DELETE FROM Borrow_List WHERE student_name = ?";
  pool.query(query, [studentName], (error, results) => {
    if (error) {
      console.error("Error deleting borrower from Borrow_List table:", error);
      callback(error);
    } else {
      callback(null, results);
    }
  });
}

// <---------------------------------------------------Pagination------------------------------------------------------------>

router.get("/borrowers", authenticateUser, (req, res) => {
  res.redirect("/borrowers/page/1");
});

router.get("/borrowers/page/:page", authenticateUser, (req, res) => {
  const page = parseInt(req.params.page);
  const limit = 6; // Number of borrowers per page
  const offset = (page - 1) * limit; // Calculate the offset based on the current page

  database.getBorrowers(limit, offset, (err, borrowers) => {
    if (err) {
      console.error("Error retrieving borrowers:", err);
      res.render("500");
      return;
    }

    const totalPages = Math.ceil(borrowers.length / limit); // Calculate the total number of pages

    res.render("Borrowers", {
      items: borrowers,
      borrowers: borrowers,
      limit: limit,
      currentPage: page,
      totalPages: totalPages,
      isAdmin: req.session.user.role_id === "Admin",
      isLabManager: req.session.user.role_id === "Lab Manager",
    });
  });
});

router.get("/borrowers/details/:id", authenticateUser, (req, res) => {
  const borrowerId = req.params.id;
  database.getBorrowerDetails(borrowerId, (err, borrowerDetails) => {
    if (err) {
      console.error("Error retrieving borrower details:", err);
      res.render("500");
      return;
    }
    res.json(borrowerDetails);
  });
});

// <----------------------------------------------------Insertion------------------------------------------------------------>

router.post("/borrowers/add", authenticateUser, (req, res) => {
  const {
    studentName,
    admissionNo,
    branch,
    semester,
    phoneNumber,
    borrowerDate,
    itemId,
  } = req.body;

  if (
    !studentName ||
    !admissionNo ||
    !branch ||
    !semester ||
    !phoneNumber ||
    !borrowerDate ||
    !itemId
  ) {
    res.render('400');
    return;
  }

  console.log("semester:", semester);
  console.log("borrowerDate:", borrowerDate);
  console.log("itemId:", itemId);

  // Check if the item exists
  database.getItemById(itemId, (err, item) => {
    if (err) {
      console.error("Error retrieving item:", err);
      res.render('500');
      return;
    }

    if (!item) {
      // Item does not exist
      res.render('400');
      return;
    }

    // Check if the student name already exists in the Borrow_List table
    database.getBorrowerIdByStudentName(studentName, (err, borrowerId) => {
      if (err) {
        console.error("Error retrieving borrower ID:", err);
        res.render('500');
        return;
      }

      if (borrowerId) {
        // Student already exists, use the existing borrower ID
        insertItemBorrower(itemId, borrowerId, borrowerDate, res);
      } else {
        // Student doesn't exist, insert a new borrower and get the generated borrower ID
        database.insertBorrower(
          studentName,
          admissionNo,
          semester,
          phoneNumber,
          branch,
          (err, newBorrowerId) => {
            if (err) {
              console.error("Error inserting new borrower:", err);
              res.render('500');
              return;
            }

            insertItemBorrower(itemId, newBorrowerId, borrowerDate, res);
          }
        );
      }
    });
  });

  // Get the user ID from the session
  const userId = req.session.user.user_id;

  // Insert the audit log record
  const action = `Added borrower ${studentName} from ${branch} Semester ${semester}`;
  insertAuditLog(userId, action, (err) => {
    if (err) {
      // Handle the error
      res.render('500');
      return;
    }
  });
});

// Helper function to insert the item borrower record
function insertItemBorrower(itemId, borrowerId, borrowerDate, res) {
  database.insertItemBorrower(itemId, borrowerId, borrowerDate, (err) => {
    if (err) {
      console.error("Error inserting item borrower:", err);
      res.render('500');
      return;
    }

    res.redirect("/borrowers/page/1");
  });
}

router.post("/borrowers/delete/:studentName", authenticateUser, (req, res) => {
  const studentName = req.params.studentName;
  deleteBorrowerByStudentName(studentName, (err, result) => {
    if (err) {
      console.error("Error deleting borrower:", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});


// <---------------------------------------------------Deletion--------------------------------------------------------------->

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
