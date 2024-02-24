const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

router.get('/',(req, res) => {
    res.status(200).json({message: 'Welcome to the API'});
});

router.get('/initialize', transactionsController.initialize);

router.get('/transactions', transactionsController.getTransactions);

router.use('/chart', require('./chart.routes'));

module.exports = router;