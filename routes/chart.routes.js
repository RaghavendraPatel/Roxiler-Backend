const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chart.controller');

router.get('/statistics',chartController.statistics);

router.get('/bar-chart',chartController.barChart);

router.get('/pie-chart',chartController.pieChart);

router.get('/combined-chart',chartController.combinedChart);

module.exports = router;