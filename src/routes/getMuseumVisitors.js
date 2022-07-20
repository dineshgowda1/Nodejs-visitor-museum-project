const express = require('express');
const router = express.Router();
const { GetMuseumVisitors } = require('../controllers/getMuseumVisitors');

router.get('/api/visitors', GetMuseumVisitors.getVisitorsData);

module.exports = router;

///api/visitors?date=1404198000000&ignore=avila_adobe