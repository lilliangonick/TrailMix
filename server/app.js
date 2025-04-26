const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const cors     = require('cors');

const User = require('./models/User');
const authRoutes = require('./routes/auth');

// load environment variables and read .env
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();

// middleware 
app.use(cors());
app.use(express.json());

// auth routes
app.use('/api/auth', authRoutes);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/status', (req, res) => {
  const state = mongoose.connection.readyState; 
  res.json({ ok: state === 1, mongoState: state });
});



