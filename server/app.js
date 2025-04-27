const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require('./models/User');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const placeRoutes = require('./routes/places');

// load environment variables and read .env
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();

app.get('/api/places/hello', (_req, res) => {
  res.send('Hello from /api/places!');
});

// middleware 
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/places', placeRoutes);

// connect to mongo and then start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

app.get('/api/status', (req, res) => {
  const state = mongoose.connection.readyState; 
  res.json({ ok: state === 1, mongoState: state });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});