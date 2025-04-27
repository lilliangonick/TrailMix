const mongoose = require("mongoose");

// create trip
const tripSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
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