const mongoose = require("mongoose");

// set the start/end locations
const locationSchema = new mongoose.Schema({
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  });

// create trip
const tripSchema = new mongoose.Schema({
    userEmail: { type: String, ref: 'User', required: true },
    startLocation: locationSchema,
    endLocation: locationSchema,
    budget:        {
      type: String,
      enum: ['1', '2', '3', '4'], // relates to each yelp $ amount
      required: true,
    },
    tripVibe:      {
      type: String,
      enum: ['foodie', 'explorer', 'shopper'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Trip', tripSchema);