const pool = require('../config/postgresql');
const axios = require('axios');

module.exports.initialize  = async (req, res) => {
    let transactions = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    transactions = transactions.data;
    try{
        await pool.query('DROP TABLE IF EXISTS transactions');

        const createTableQuery = `CREATE TABLE transactions (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255),
            price NUMERIC,
            description TEXT,
            category VARCHAR(255),
            sold BOOLEAN,
            dateOfSale DATE
        )`;

        await pool.query(createTableQuery);

        // await pool.query('BEGIN');
        transactions.forEach(async(transaction) => {
            const insertTransactionQuery = `INSERT INTO transactions (title, price, description, category, sold, dateOfSale) VALUES ($1, $2, $3, $4, $5, $6)`;
            await pool.query(insertTransactionQuery, [transaction.title, transaction.price, transaction.description, transaction.category, transaction.sold, transaction.dateOfSale]);
        });

        // await pool.query('COMMIT');
        res.status(200).json({message: 'Table initialized'});
    }
    catch(error){
        await pool.query('ROLLBACK');
        res.status(500).json({error: error});
    }
}

module.exports.getTransactions = async (req, res) => {
    const { page = 1, limit = 10, search = '', month } = req.query;
    const offset = (page - 1) * limit;
    let searchQuery = '';
    if (search) {
      searchQuery = `AND (title ILIKE '%${search}%' OR description ILIKE '%${search}%' OR CAST(price AS TEXT) ILIKE '%${search}%')`;
    }
  
    let monthQuery = '';
    if (month) {
      const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;
      monthQuery = `AND EXTRACT(MONTH FROM dateOfSale) = ${monthNumber}`;
    }
  
    try {
      const transactions = await pool.query(
        `SELECT * FROM transactions WHERE true ${searchQuery} ${monthQuery} ORDER BY id ASC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      res.json(transactions.rows);
      } catch (error) {
        res.status(500).json({ error: error });
      }
}