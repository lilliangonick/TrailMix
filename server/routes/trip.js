const express = require('express');
const router = express.Router();
const { createTrip } = require('../controllers/tripController');
const { authenticateUser } = require('../middleware/auth');

// create a new trip
router.post('/', authenticateUser, createTrip);

module.exports = router; 