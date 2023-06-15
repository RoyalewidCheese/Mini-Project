const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gracevilla',
  database: 'Project',
  connectionLimit: 10
});

// <----------------------------------------------Dashboard Display--------------------------------------------------------->
 
function getItem(limit, offset, callback) {
  const query = `
  SELECT Category.cat_name AS Category, Brands.brand_name AS Brand, Category.model_name AS Model, Items.lab_location AS LabLocation, Items.item_warranty AS Warranty, Items.item_status AS Status
  FROM Items
  INNER JOIN Category ON Items.cat_id = Category.cat_id
  INNER JOIN Brands ON Category.brand_id = Brands.brand_id
  WHERE Items.item_warranty <= DATE_ADD(CURDATE(), INTERVAL 6 MONTH)
  LIMIT ?, ?  
  `;

    pool.query(query, [offset, limit], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    callback(null, results);
  });
};

function query(sql, params, callback) {
  getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      callback(err, null);
      return;
    }

    connection.query(sql, params, (err, results) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing query:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  });
}

// <----------------------------------------------Borrowers Display-------------------------------------------------------->

function getBorrowers(limit, offset, callback) {
  const query = `
    SELECT bl.borrower_id, bl.student_name, i.item_id, c.cat_name, i.lab_location
    FROM Borrow_List bl
    INNER JOIN Item_Borrower ib ON bl.borrower_id = ib.borrower_id
    INNER JOIN Items i ON ib.item_id = i.item_id
    INNER JOIN Category c ON i.cat_id = c.cat_id
    LIMIT ? OFFSET ?
  `;

  const params = [limit, offset];

  pool.query(query, params, callback);
}

function getBorrowerDetails(borrowerId, callback) {
  const query = `
    SELECT bl.student_name, bl.admission_no, bl.branch, bl.semester, bl.phone_number, ib.borrower_date
    FROM Borrow_List bl
    INNER JOIN Item_Borrower ib ON bl.borrower_id = ib.borrower_id
    WHERE ib.borrower_id = ?
  `;

  pool.query(query, [borrowerId], callback);
}

// Function to get the borrower ID by student name
function getBorrowerIdByStudentName(studentName, callback) {
  const query = 'SELECT borrower_id FROM Borrow_List WHERE student_name = ?';
  pool.query(query, [studentName], (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    if (results.length > 0) {
      const borrowerId = results[0].borrower_id;
      callback(null, borrowerId);
    } else {
      callback(null, null); // Borrower not found
    }
  });
}

// <----------------------------------------------Borrowers Insert-------------------------------------------------------->

// Function to insert a new borrower record
function insertBorrower(studentName, admissionNo, semester, phoneNumber, branch, callback) {
  const query = 'INSERT INTO Borrow_List (student_name, admission_no, semester, phone_number, branch) VALUES (?, ?, ?, ?, ?)';
  const values = [studentName, admissionNo, semester, phoneNumber, branch];
  pool.query(query, values, (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    const newBorrowerId = results.insertId;
    callback(null, newBorrowerId);
  });
}

// Function to insert a new item borrower record
function insertItemBorrower(itemId, borrowerId, borrowerDate, callback) {
  const query = 'INSERT INTO Item_Borrower (item_id, borrower_id, borrower_date) VALUES (?, ?, ?)';
  const values = [itemId, borrowerId, borrowerDate];
  pool.query(query, values, callback);
}

function query(sql, values, callback) {
  console.log('Executing SQL query:', sql, 'with values:', values);
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
      return;
    }

    connection.query(sql, values, (err, results) => {
      connection.release();
      callback(err, results);
    });
  });
}

// <----------------------------------------------Items Insert-------------------------------------------------------->

// Get the brand_id for the given brand name
function getBrandIdByName(brandName, callback) {
  const sql = 'SELECT brand_id FROM Brands WHERE brand_name = ?';
  query(sql, [brandName], (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    if (results.length > 0) {
      callback(null, results[0].brand_id);
    } else {
      callback(null, null);
    }
  });
}

// Insert a new brand into the Brands table
function insertBrand(brandName, callback) {
  const sql = 'INSERT INTO Brands (brand_name) VALUES (?)';
  query(sql, [brandName], (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, results.insertId);
  });
}

// Get the cat_id for the given category name and brand_id
function getCategoryIdByNameAndBrand(categoryName, brandId, callback) {
  const sql = 'SELECT cat_id FROM Category WHERE cat_name = ? AND brand_id = ?';
  query(sql, [categoryName, brandId], (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    if (results.length > 0) {
      callback(null, results[0].cat_id);
    } else {
      callback(null, null);
    }
  });
}

// Insert a new category into the Category table
function insertCategory(categoryName, brandId, modelName, callback) {
  const sql = 'INSERT INTO Category (cat_name, brand_id, model_name) VALUES (?, ?, ?)';
  query(sql, [categoryName, brandId, modelName], (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, results.insertId);
  });
}

// Insert a new item into the Items table
function insertItem(
  itemId,
  itemWarranty,
  itemStatus,
  labLocation,
  rate,
  quantity,
  totalAmount,
  categoryId,
  description,
  type,
  callback
) {
  const sql =
    'INSERT INTO Items (item_id, item_warranty, item_status, lab_location, rate, quantity, total_amount, cat_id, description, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    itemId,
    itemWarranty,
    itemStatus,
    labLocation,
    rate,
    quantity,
    totalAmount,
    categoryId,
    description,
    type
  ];
  query(sql, values, (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, results.insertId);
  });
}

// Function to execute a SQL query
function query(sql, values, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
      return;
    }

    connection.query(sql, values, (err, results) => {
      connection.release();
      callback(err, results);
    });
  });
}
// <----------------------------------------------Items Display-------------------------------------------------------->

function getItems(limit, offset, callback) {
  const query = `
    SELECT i.item_id, c.cat_name, b.brand_name, i.item_status
    FROM Items i
    INNER JOIN Category c ON i.cat_id = c.cat_id
    INNER JOIN Brands b ON c.brand_id = b.brand_id
    LIMIT ? OFFSET ?
  `;

  const params = [limit, offset];

  pool.query(query, params, callback);
}

// Retrieve an item by item_id
function getItemByItemId(itemId, callback) {
  const query = 'SELECT * FROM Items WHERE item_id = ?';
  pool.query(query, [itemId], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (results.length > 0) {
      const existingItem = results[0];
      callback(null, existingItem);
    } else {
      callback(null, null); // Item not found
    }
  });
}

// Function to get all items
function getAllItems(callback) {
  const sqlQuery = `SELECT
    Items.item_id AS \`item_id\`,
    Category.cat_name AS \`category\`,
    Brands.brand_name AS \`brand\`,
    Items.item_status AS \`status\`
    FROM
    Items
    JOIN Category ON Items.cat_id = Category.cat_id
    JOIN Brands ON Category.brand_id = Brands.brand_id;`;

  query(sqlQuery, [], (err, items) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, items);
  });
}

function getItemById(itemId, callback) {
  const query = `
    SELECT
      Items.item_id AS ItemID,
      Category.cat_name AS Category,
      Brands.brand_name AS Brand, 
      Category.model_name AS Model,
      Items.description AS Description,
      Items.item_warranty AS Warranty,
      Items.lab_location AS LabLocation,
      Items.item_status AS Status,
      Items.quantity AS Quantity,
      Items.rate AS PricePerItem,
      Items.total_amount AS TotalPrice,
      Items.type AS Type
    FROM
      Items
      INNER JOIN Category ON Items.cat_id = Category.cat_id
      INNER JOIN Brands ON Category.brand_id = Brands.brand_id
    WHERE
      Items.item_id = ?
  `;

  pool.query(query, [itemId], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (results.length === 0) {
      // Item not found
      callback(null, null);
      return;
    }

    const item = results[0];
    callback(null, item);
  });
}

// Get the category ID by category name and model
function getCategoryIdByCategoryAndModel(category, model, callback) {
  const query = `
    SELECT cat_id
    FROM Category
    WHERE cat_name = ? AND model_name = ?
  `;
  const values = [category, model];

  pool.query(query, values, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (results.length > 0) {
      const categoryId = results[0].cat_id;
      callback(null, categoryId);
    } else {
      callback(null, null);
    }
  });
}

// <-------------------------------------------------Mainstock Display---------------------------------------------------------------->

// Assuming you have a database connection established

function getStockData(callback) {
  const query = `
  SELECT
  Stock.indent_no,
  Stock.sub_indent_no,
  Stock.stock_no,
  Items.item_id
FROM
  Stock
  RIGHT JOIN Items ON Stock.item_id = Items.item_id

  `;

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving items:', err);
      callback(err, null);
      return;
    }

    callback(null, result);
  });
}



// Function to retrieve item details from the database
function getViewDetails(itemId, callback) {
  const query = `
    SELECT
      Items.item_id,
      Category.cat_name,
      Stock.reference_page,
      Stock.invoice_id,
      Invoice.invoice_date,
      Supplier.supplier_name,
      Stock.stock_type,
      Stock.sub_indent_no,
      Stock.stock_no,
      Stock.indent_no
    FROM
      Items
      LEFT JOIN Stock ON Stock.item_id = Items.item_id
      LEFT JOIN Category ON Stock.cat_id = Category.cat_id
      LEFT JOIN Invoice ON Stock.invoice_id = Invoice.invoice_id
      LEFT JOIN Supplier ON Stock.supplier_id = Supplier.supplier_id
    WHERE
      Items.item_id = ?
  `;

  pool.query(query, itemId, (err, result) => {
    if (err) {
      console.error('Error retrieving item details:', err);
      callback(err, null);
      return;
    }

    if (result.length === 0) {
      // No item details found for the given itemId
      callback(null, null);
      return;
    }

    callback(null, result[0]);
  });
}

function getAllSortedStockData(column, order, callback) {
  const query = `
  SELECT
  Stock.indent_no,
  Stock.sub_indent_no,
  Stock.stock_no,
  Stock.item_id
FROM
  Stock
LEFT JOIN Items ON Stock.item_id = Items.item_id
WHERE
  Stock.indent_no IS NULL
  OR Stock.sub_indent_no IS NULL
  OR Stock.stock_no IS NULL
UNION
SELECT
  Stock.indent_no,
  Stock.sub_indent_no,
  Stock.stock_no,
  Items.item_id
FROM
  Stock
RIGHT JOIN Items ON Stock.item_id = Items.item_id
    ORDER BY
      ${column} ${order}
  `;

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving sorted items:', err);
      callback(err, null);
      return;
    }

    callback(null, result);
  });
}

// <-------------------------------------------------Mainstock Insert---------------------------------------------------------------->

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

// Assuming you have the getConnection function defined in your database module

// Function to update the profile picture in the database
function updateProfilePicture(userId, profilePictureData, callback) {
  getConnection((err, connection) => {
    if (err) {
      // Handle the error, e.g., pass it to the callback function
      callback(err);
    } else {
      const sql = 'UPDATE users SET profile = ? WHERE user_id = ?';
      connection.query(sql, [profilePictureData, userId], (error, results) => {
        // Release the connection
        connection.release();
        
        if (error) {
          // Handle the error, e.g., pass it to the callback function
          callback(error);
        } else {
          // Profile picture updated successfully
          // Pass the results or any other relevant data to the callback function
          callback(null, results);
        }
      });
    }
  });
}

// <------------------------------------------------------------------------------------------------------------------------>

module.exports = {
  getItem,
  query,
  getBorrowers,
  getBorrowerDetails,
  getBorrowerIdByStudentName,
  insertBorrower,
  insertItemBorrower,
  getBrandIdByName,
  insertBrand,
  getCategoryIdByNameAndBrand,
  insertCategory,
  insertItem,
  getItems,
  getItemByItemId,
  getCategoryIdByCategoryAndModel,
  getAllItems,
  getItemById,
  getStockData,
  getViewDetails,
  getAllSortedStockData,
  getConnection,
  updateProfilePicture
};
