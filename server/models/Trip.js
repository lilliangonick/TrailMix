const mongoose = require("mongoose");

// create trip
const tripSchema = new mongoose.Schema({
    ownerEmail: { type: String, required: true }, // The user who created the trip
    sharedWith: [{ type: String }], // Users who have access to this trip
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    passengers: { type: Number, required: true },
    activities: [{ type: String }],
    budget: { 
      type: String,
      enum: ['1', '2', '3', '4'], // relates to each yelp $ amount
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Trip', tripSchema);