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

// <----------------------------------------------Handling and Inserting---------------------------------------------------->

router.get("/items", authenticateUser, (req, res) => {
  res.redirect("/items/page/1");
});

// Handle the form submission to add an item
router.post('/add-item', authenticateUser, (req, res) => {
  const {
    itemid,
    category,
    brand,
    model,
    lab,
    description,
    warranty,
    quantity,
    type,
    status,
    price,
    totalprice
  } = req.body;

  // Check if the item already exists
  db.getItemByItemId(itemid, (err, existingItem) => {
    if (err) {
      console.error(err);
      return res.render('500');
    }

    if (existingItem) {
      // Item already exists, return a bad request error
      return res.render('400');
    }

    // Get the brand_id for the given brand name
    db.getBrandIdByName(brand, (err, brandId) => {
      if (err) {
        console.error(err);
        return res.render('500');
      }

      if (!brandId) {
        // Brand does not exist, insert it first
        db.insertBrand(brand, (err, newBrandId) => {
          if (err) {
            console.error(err);
            return res.render('500');
          }

          // Insert the new item using the new brand_id
          insertItem(newBrandId);
        });
      } else {
        // Brand already exists, insert the item directly
        insertItem(brandId);
      }
    });
  });

  function insertItem(brandId) {
    // Check if the category and model combination already exists
    db.getCategoryIdByCategoryAndModel(category, model, (err, categoryId) => {
      if (err) {
        console.error(err);
        return res.render('500');
      }

      if (!categoryId) {
        // Category and model combination does not exist, insert them first
        db.insertCategory(category, brandId, model, (err, newCategoryId) => {
          if (err) {
            console.error(err);
            return res.render('500');
          }

          // Insert the new item using the new cat_id
          insertItemRecord(newCategoryId);
        });
      } else {
        // Category and model combination already exists, insert the item directly
        insertItemRecord(categoryId);
      }
    });
  }

  function insertItemRecord(categoryId) {
    // Insert the item into the Items table
    db.insertItem(
      itemid,
      warranty,
      status,
      lab,
      price,
      quantity,
      totalprice,
      categoryId,
      description,
      type,
      (err, newItemId) => {
        if (err) {
          console.error(err);
          return res.render('500');
        }

        // Get the user ID from the session
        const userId = req.session.user.user_id;

        // Insert the audit log record
        const action = `Added Item ${itemid} of ${category} and Model ${model}`;
        insertAuditLog(userId, action, (err) => {
          if (err) {
            console.error(err);
            return res.render('500');
          }

          // Redirect to a success page or display a success message
          res.redirect('/items/page/1');
        });
      }
    );
  }
});

// <------------------------------------------------Pagination--------------------------------------------------------------->

router.get('/items', authenticateUser, (req, res) => {
  res.redirect('/items/page/1');
});

router.get('/items/page/:page', authenticateUser, (req, res) => {
  const page = parseInt(req.params.page);
  const limit = 6; // Number of items per page
  const offset = (page - 1) * limit; // Calculate the offset based on the current page

  db.getItems(limit, offset, (err, Items) => {
    if (err) {
      console.error('Error retrieving borrowers:', err);
      res.render('500');
      return;
    }

    const totalPages = Math.ceil(Items.length / limit); // Calculate the total number of pages

    res.render('Items', {
      items: Items,
      borrowers: Items,
      limit: limit,
      currentPage: page,
      totalPages: totalPages,
      isAdmin: req.session.user.role_id === "Admin",
      isLabManager: req.session.user.role_id === "Lab Manager",
    });
  });
});

// <------------------------------------------------View Details------------------------------------------------------->

router.get('/api/items/:itemId', authenticateUser, (req, res) => {
  const itemId = req.params.itemId;

  // Retrieve the item details from the database based on the item ID
  db.getItemById(itemId, (err, item) => {
    if (err) {
      console.error(err);
      res.render('500');
      return;
    }

    if (!item) {
      // Item not found
      res.render('404');
      return;
    }

    // Return the item details as a JSON response
    res.json(item);
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

// <------------------------------------------------------------------------------------------------------------------------->

// DELETE /api/items/:itemId
router.delete('/api/items/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  // Delete the item from the database
  const deleteQuery = 'DELETE FROM items WHERE item_id = ?';

  pool.query(deleteQuery, [itemId], (err, results) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).render('500');
    }

    if (results.affectedRows > 0) {
      // Get the user ID from the session
      const userId = req.session.user.user_id;

      // Insert the audit log record
      const action = `Deleted Item ${itemId}`;
      insertAuditLog(userId, action, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).render('500');
        }

        // Reload the page
        res.send('<script>window.location.reload()</script>');
      });
    } else {
      res.status(404).render('404');
    }
  });
});


router.post('/update-item', (req, res) => {
  const { item_id, warranty, status, lab, price, quantity, totalprice, description, type, category, brand, model } = req.body;

  // Retrieve the category ID based on the category name
  pool.query(
    'SELECT cat_id FROM Category WHERE cat_name = ?',
    [category],
    (error, categoryResults) => {
      if (error) {
        console.error('Error retrieving category:', error);
        res.status(500).render('500');
        return;
      }

      let categoryId;
      if (categoryResults.length === 0) {
        // Category doesn't exist, insert a new category
        pool.query(
          'INSERT INTO Category (cat_name) VALUES (?)',
          [category],
          (error, insertCategoryResult) => {
            if (error) {
              console.error('Error inserting category:', error);
              res.status(500).render('500');
              return;
            }

            categoryId = insertCategoryResult.insertId;

            // Proceed with updating the item after inserting the category
            updateItem(categoryId);
          }
        );
      } else {
        categoryId = categoryResults[0].cat_id;

        // Proceed with updating the item if the category already exists
        updateItem(categoryId);
      }

      function updateItem(categoryId) {
        // Retrieve the brand ID based on the brand name
        pool.query(
          'SELECT brand_id FROM Brands WHERE brand_name = ?',
          [brand],
          (error, brandResults) => {
            if (error) {
              console.error('Error retrieving brand:', error);
              res.status(500).render('500');
              return;
            }

            let brandId;
            if (brandResults.length === 0) {
              // Brand doesn't exist, insert a new brand
              pool.query(
                'INSERT INTO Brands (brand_name) VALUES (?)',
                [brand],
                (error, insertBrandResult) => {
                  if (error) {
                    console.error('Error inserting brand:', error);
                    res.status(500).render('500');
                    return;
                  }

                  brandId = insertBrandResult.insertId;

                  // Proceed with updating the item after inserting the brand
                  updateItemDetails(categoryId, brandId);
                }
              );
            } else {
              brandId = brandResults[0].brand_id;

              // Proceed with updating the item if the brand already exists
              updateItemDetails(categoryId, brandId);
            }
          }
        );
      }

      function updateItemDetails(categoryId, brandId) {
        // Update the item in the database
        pool.query(
          'UPDATE Items SET item_warranty = ?, item_status = ?, lab_location = ?, rate = ?, quantity = ?, total_amount = ?, description = ?, type = ?, cat_id = ? WHERE item_id = ?',
          [warranty, status, lab, price, quantity, totalprice, description, type, categoryId, item_id],
          (error, updateResults) => {
            if (error) {
              console.error('Error updating item:', error);
              res.status(500).render('500');
            } else {
              // Update the category's brand_id in the Category table
              pool.query(
                'UPDATE Category SET brand_id = ?, model_name = ? WHERE cat_id = ?',
                [brandId, model, categoryId],
                (error, updateCategoryResults) => {
                  if (error) {
                    console.error('Error updating category:', error);
                    res.status(500).render('500');
                  } else {
                    // Get the user ID from the session
                    const userId = req.session.user.user_id;

                    // Insert the audit log record
                    const action = `Updated Item ${item_id} of ${category} and Model ${model}`;
                    insertAuditLog(userId, action, (err) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).render('500');
                      }

                      // Redirect to a success page or display a success message
                      res.redirect('/items/page/1');
                    });
                  }
                }
              );
            }
          }
        );
      }                
    }
  );
});

module.exports = router;
