// server/controllers/tripController.js
const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
  try {
    const { startLocation, endLocation, budget, tripVibe, startDate, endDate } = req.body;

    // validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }
    
    const trip = new Trip({
      userEmail: req.user.email,
      startLocation,
      endLocation,
      budget,
      tripVibe,
      startDate,
      endDate
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
