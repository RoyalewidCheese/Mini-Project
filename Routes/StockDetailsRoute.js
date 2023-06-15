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

router.get("/stockdetails", authenticateUser, (req, res) => {
  res.redirect("/stockdetails/page/1");
});

// Handle form submission
router.post('/add-stockdetails', authenticateUser, (req, res) => {
  const {
    indent_no,
    sub_indent_no,
    stock_no,
    item_id,
    invoice_id,
    invoice_date,
    supplier_name,
    stock_type,
    reference_page
  } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.render('500');
    }

    // Perform the database insertion
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error beginning transaction:', err);
        return connection.rollback(() => {
          res.render('500');
          connection.release();
        });
      }

      // Check if the item_id exists in the Items table
      const checkItemQuery = 'SELECT * FROM Items WHERE item_id = ?';
      connection.query(checkItemQuery, [item_id], (err, results) => {
        if (err) {
          console.error('Error checking if the item_id exists in Items table:', err);
          return connection.rollback(() => {
            console.error('Rolling back transaction');
            res.render('500');
            connection.release();
          });
        }

        if (results.length === 0) {
          console.error('Item with the given item_id does not exist in Items table');
          return connection.rollback(() => {
            console.error('Rolling back transaction');
            res.render('400');
            connection.release();
          });
        }

        // Check if the item_id already exists in the Stock table
        const checkStockQuery = 'SELECT * FROM Stock WHERE item_id = ?';
        connection.query(checkStockQuery, [item_id], (err, results) => {
          if (err) {
            console.error('Error checking if the item_id exists in Stock table:', err);
            return connection.rollback(() => {
              console.error('Rolling back transaction');
              res.render('500');
              connection.release();
            });
          }

          if (results.length > 0) {
            console.error('Item with the given item_id already exists in Stock table');
            return connection.rollback(() => {
              console.error('Rolling back transaction');
              res.render('400');
              connection.release();
            });
          }

          // Check if the supplier exists
          const checkSupplierQuery = 'SELECT supplier_id FROM Supplier WHERE supplier_name = ?';
          connection.query(checkSupplierQuery, [supplier_name], (err, results) => {
            if (err) {
              console.error('Error checking if the supplier exists:', err);
              return connection.rollback(() => {
                console.error('Rolling back transaction');
                res.render('500');
                connection.release();
              });
            }

            let supplierId;
            if (results.length > 0) {
              // Supplier exists, use the existing supplier_id
              supplierId = results[0].supplier_id;
              insertData(supplierId);
            } else {
              // Supplier doesn't exist, insert a new supplier
              const insertSupplierQuery = 'INSERT INTO Supplier (supplier_name) VALUES (?)';
              connection.query(insertSupplierQuery, [supplier_name], (err, results) => {
                if (err) {
                  console.error('Error inserting new supplier:', err);
                  return connection.rollback(() => {
                    console.error('Rolling back transaction');
                    res.render('500');
                    connection.release();
                  });
                }

                // Get the newly inserted supplier_id
                supplierId = results.insertId;
                insertData(supplierId);
              });
            }

            function insertData(supplierId) {
              // Insert the data into the Stock table
              const stockQuery = `INSERT INTO Stock (indent_no, sub_indent_no, stock_no, item_id, invoice_id, supplier_id, cat_id, reference_page, stock_type) 
                VALUES (?, ?, ?, ?, ?, ?, (SELECT cat_id FROM Items WHERE item_id = ?), ?, ?)`;
              const stockValues = [
                indent_no,
                sub_indent_no,
                stock_no,
                item_id,
                invoice_id,
                supplierId,
                item_id,
                reference_page,
                stock_type
              ];

              console.log('Stock Values:', stockValues);

              // Insert the data into the Invoice table
              const invoiceQuery = `INSERT INTO Invoice (invoice_id, invoice_date) 
                SELECT ?, ? 
                FROM dual 
                WHERE NOT EXISTS (SELECT * FROM Invoice WHERE invoice_id = ?)`;
              const invoiceValues = [invoice_id, invoice_date, invoice_id];

              // Insert into Stock table
              connection.query(stockQuery, stockValues, (err) => {
                if (err) {
                  console.error('Error inserting into Stock table:', err);
                  return connection.rollback(() => {
                    console.error('Rolling back transaction');
                    res.render('500');
                    connection.release();
                  });
                }

                // Insert into Invoice table
                connection.query(invoiceQuery, invoiceValues, (err) => {
                  if (err) {
                    console.error('Error inserting into Invoice table:', err);
                    return connection.rollback(() => {
                      console.error('Rolling back transaction');
                      res.render('500');
                      connection.release();
                    });
                  }

                  connection.commit((err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                      return connection.rollback(() => {
                        console.error('Rolling back transaction');
                        res.render('500');
                        connection.release();
                      });
                    }

                    console.log('Data inserted successfully');
                    connection.release();
                    res.redirect('/stockdetails/page/1');
                  });
                });
              });
            }
          });
        });
      });
    });
  });
});

// <-----------------------------------------------------Pagination---------------------------------------------------------->

router.get('/stockdetails/page/:page', authenticateUser, (req, res) => {
  db.getStockData((err, Mainstock) => {
    if (err) {
      console.error('Error retrieving items:', err);
      res.render('404');
      return;
    }

    res.render('StockDetails', {
      items: Mainstock,
      isAdmin: req.session.user.role_id === 'Admin', // Add this line
      isLabManager: req.session.user.role_id === "Lab Manager",
    });
  });
});

// <-----------------------------------------------------View Details-------------------------------------------------------->

router.get('/stockdetails/item-details/:itemId', authenticateUser, (req, res) => {
  const itemId = req.params.itemId;

  db.getViewDetails(itemId, (err, itemDetails) => {
    if (err) {
      console.error('Error retrieving item details:', err);
      res.render('500');
      return;
    }

    res.json(itemDetails);
  });
});

router.get('/stockdetails/sort/:column/:order', authenticateUser, (req, res) => {
  const column = req.params.column;
  const order = req.params.order;

  db.getAllSortedStockData(column, order, (err, sortedMainstock) => {
    if (err) {
      console.error('Error retrieving sorted items:', err);
      res.render('500');
      return;
    }

    res.json(sortedMainstock);
  });
});

// <-------------------------------------------------------Updation---------------------------------------------------------------->

// Handle stock details update
router.post('/update-stockdetails', authenticateUser, (req, res) => {
  const {
    item_id,
    indent_no,
    sub_indent_no,
    stock_no,
    invoice_id,
    invoice_date,
    supplier_name,
    stock_type,
    reference_page
  } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.render('500');
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        connection.release();
        return res.render('500');
      }

      // Retrieve the supplier_id for the given supplier_name
      const getSupplierIdQuery = 'SELECT supplier_id FROM Supplier WHERE supplier_name = ?';
      connection.query(getSupplierIdQuery, [supplier_name], (err, results) => {
        if (err) {
          console.error('Error retrieving supplier_id:', err);
          return connection.rollback(() => {
            console.error('Rolling back transaction');
            res.render('500');
            connection.release();
          });
        }

        let supplierId;
        if (results.length > 0) {
          // Supplier exists, use the existing supplier_id
          supplierId = results[0].supplier_id;
          updateInvoice();
        } else {
          // Supplier not found, insert a new supplier
          const insertSupplierQuery = 'INSERT INTO Supplier (supplier_name) VALUES (?)';
          connection.query(insertSupplierQuery, [supplier_name], (err, result) => {
            if (err) {
              console.error('Error inserting new supplier:', err);
              return connection.rollback(() => {
                console.error('Rolling back transaction');
                res.render('500');
                connection.release();
              });
            }

            supplierId = result.insertId;
            updateInvoice();
          });
        }

        // Update the invoice details in the Invoice table
        function updateInvoice() {
          const updateInvoiceQuery = 'INSERT INTO Invoice (invoice_id, invoice_date) VALUES (?, ?) ON DUPLICATE KEY UPDATE invoice_date = ?';
          const updateInvoiceValues = [invoice_id, invoice_date, invoice_date];
          connection.query(updateInvoiceQuery, updateInvoiceValues, (err) => {
            if (err) {
              console.error('Error updating invoice details:', err);
              return connection.rollback(() => {
                console.error('Rolling back transaction');
                res.render('500');
                connection.release();
              });
            }

            // Update the stock details in the Stock table
            const updateStockQuery = 'UPDATE Stock SET indent_no = ?, sub_indent_no = ?, stock_no = ?, supplier_id = ?, invoice_id = ?, stock_type = ?, reference_page = ? WHERE item_id = ?';
            const updateStockValues = [indent_no, sub_indent_no, stock_no, supplierId, invoice_id, stock_type, reference_page, item_id];
            connection.query(updateStockQuery, updateStockValues, (err) => {
              if (err) {
                console.error('Error updating stock details:', err);
                return connection.rollback(() => {
                  console.error('Rolling back transaction');
                  res.render('500');
                  connection.release();
                });
              }

              // Insert the audit log record
              const userId = req.session.user.user_id;
              const action = `Stock Details updated for Item ID: ${item_id}, Indent No: ${indent_no}, Invoice ID: ${invoice_id}`;
              insertAuditLog(userId, action, (error, results) => {
                if (error) {
                  console.error("Error inserting audit log record:", error);
                  return connection.rollback(() => {
                    console.error('Rolling back transaction');
                    res.render('500');
                    connection.release();
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                    return connection.rollback(() => {
                      console.error('Rolling back transaction');
                      res.render('500');
                      connection.release();
                    });
                  }

                  console.log('Stock details updated successfully');
                  console.log('Item ID:', item_id);
                  console.log('Indent No:', indent_no);
                  console.log('Sub Indent No:', sub_indent_no);
                  console.log('Stock No:', stock_no);
                  console.log('Supplier ID:', supplierId);
                  console.log('Invoice ID:', invoice_id);
                  console.log('Invoice Date:', invoice_date);
                  console.log('Stock Type:', stock_type);
                  console.log('Reference Page:', reference_page);

                  res.redirect('/stockdetails/page/1');
                  connection.release();
                });
              });
            });
          });
        }
      });
    });
  });
});

module.exports = router;


// <-------------------------------------------------------Deletion---------------------------------------------------------------->

router.delete('/delete-item/:itemId', authenticateUser, (req, res) => {
  const itemId = req.params.itemId;

  // Acquire a connection from the pool
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error acquiring database connection:', err);
      res.render('500');
      return;
    }

    // Delete the item from the Stock table
    const deleteStockQuery = `DELETE FROM Stock WHERE item_id = ?`;
    connection.query(deleteStockQuery, [itemId], (err, result) => {
      if (err) {
        console.error('Error deleting item from Stock table:', err);
        connection.release(); // Release the connection back to the pool
        res.render('500');
        return;
      }

      // Delete the item from the Items table
      const deleteItemsQuery = `DELETE FROM Items WHERE item_id = ?`;
      connection.query(deleteItemsQuery, [itemId], (err, result) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error('Error deleting item from Items table:', err);
          res.render('500');
          return;
        }

        if (result.affectedRows === 0) {
          console.warn('Item not found in Stock table. Deleting from Items table only.');
          res.redirect('/stockdetails/page/'); // Send a success response
          return;
        }

        res.redirect('/stockdetails/page/'); // Send a success response
      });
    });
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
