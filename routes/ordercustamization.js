const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Import the mysql2/promise package

const {config} = require('../config/helpers'); // Import the MySQL configuration

// Create a MySQL connection pool
const pool = mysql.createPool(config);

// GET order customizations
router.get('/ordercustomizations', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to fetch order customizations
    const [rows] = await connection.query('SELECT * FROM OrderCustomizations');

    // Release the connection
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error retrieving order customizations:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching order customizations' });
  }
});

// GET categories
router.get('/customize-categories', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to fetch categories with isIngredient = 'yes' and level > 0
    const sql = 'SELECT * FROM categories WHERE isIngredient = ? AND level > 0 ORDER BY level ASC';
    const [rows] = await connection.query(sql, ['yes']);

    // Release the connection
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error retrieving categories:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
});

// GET order review by ReviewID with ingredient names as an array
router.get('/customize-categories/:CategoryID', async (req, res) => {
  try {
    const { CategoryID } = req.params; // Extract ReviewID from the URL parameters

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // SQL query to fetch the order review by ReviewID with ingredient information
    const query = `
      SELECT * from ingredients where CategoryID = ?;`;

    // Execute the query with ReviewID as a parameter
    const [rows] = await connection.query(query, [CategoryID]);

    // Release the connection
    connection.release();

      // Return the modified JSON response
      res.json(rows);
  } catch (error) {
    console.error('Error retrieving order review:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching the order review' });
  }
});


// POST order customizations
router.post('/ordercustomizations', async (req, res) => {
  try {
    const { OrderID, IngredientID } = req.body;

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Insert order customization data
    await connection.query('INSERT INTO OrderCustomizations (OrderID, IngredientID) VALUES (?, ?)', [OrderID, IngredientID]);

    // Release the connection
    connection.release();

    res.json({ message: 'Order customization added successfully' });
  } catch (error) {
    console.error('Error adding order customization:', error.message);
    res.status(500).json({ error: 'An error occurred while adding the order customization' });
  }
});

// PUT (Update) order customizations
router.put('/ordercustomizations/:id', async (req, res) => {
  try {
    const orderCustomizationID = req.params.id;
    const { OrderID, IngredientID } = req.body;

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Update order customization data
    await connection.query(
      'UPDATE OrderCustomizations SET OrderID = ?, IngredientID = ? WHERE OrderCustomizationID = ?',
      [OrderID, IngredientID, orderCustomizationID]
    );

    // Release the connection
    connection.release();

    res.json({ message: 'Order customization updated successfully' });
  } catch (error) {
    console.error('Error updating order customization:', error.message);
    res.status(500).json({ error: 'An error occurred while updating the order customization' });
  }
});

// DELETE order customizations
router.delete('/ordercustomizations/:id', async (req, res) => {
  try {
    const orderCustomizationID = req.params.id;

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Delete the order customization
    await connection.query('DELETE FROM OrderCustomizations WHERE OrderCustomizationID = ?', [orderCustomizationID]);

    // Release the connection
    connection.release();

    res.json({ message: 'Order customization deleted successfully' });
  } catch (error) {
    console.error('Error deleting order customization:', error.message);
    res.status(500).json({ error: 'An error occurred while deleting the order customization' });
  }
});

module.exports = router;
