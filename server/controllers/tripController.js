// server/controllers/tripController.js
const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
  try {
    console.log('Received trip data:', req.body);
    
    // Validate required fields
    const requiredFields = ['startLocation', 'endLocation', 'startDate', 'endDate', 'passengers', 'budget', 'additionalUsers'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.log(`Missing required field: ${field}`);
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const { 
      startLocation, 
      endLocation, 
      startDate, 
      endDate, 
      passengers, 
      activities = [], 
      additionalUsers = [],
      budget 
    } = req.body;

    // Get user email from the authenticated user
    if (!req.user || !req.user.email) {
      console.log('No authenticated user found');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('Creating trip with owner email:', req.user.email);

    // Create a single trip document
    const trip = new Trip({
      ownerEmail: req.user.email,
      sharedWith: Array.isArray(additionalUsers) ? additionalUsers : [additionalUsers],
      startLocation,
      endLocation,
      startDate,
      endDate,
      passengers: parseInt(passengers),
      activities: Array.isArray(activities) ? activities : [activities],
      budget
    });

    console.log('Attempting to save trip:', trip);

    const savedTrip = await trip.save();
    console.log('Trip saved successfully:', savedTrip);
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error('Detailed error creating trip:', err);
    if (err.name === 'ValidationError') {
      console.log('Validation Error Details:', {
        errors: err.errors,
        message: err.message,
        receivedData: req.body
      });
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: Object.values(err.errors).map(e => e.message),
        receivedData: req.body
      });
    }
    res.status(500).json({ error: 'Failed to create trip', details: err.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.log('No authenticated user found');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get trips where user is either the owner or has been shared with
    const trips = await Trip.find({
      $or: [
        { ownerEmail: req.user.email },
        { sharedWith: req.user.email }
      ]
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(trips);
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ error: 'Failed to fetch trips', details: err.message });
  }
};
