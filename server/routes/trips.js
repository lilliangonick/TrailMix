const express = require('express');
const router = express.Router();
const { createTrip, getTrips } = require('../controllers/tripController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all trip routes
router.use(authenticateToken);

// Get all trips for the authenticated user
router.get('/', getTrips);

// Create a new trip
router.post('/', createTrip);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = router; 