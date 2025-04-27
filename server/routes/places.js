const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const axios = require('axios');

router.get('/recommendations', placeController.getRecommendations);

// Get image for a location
router.get('/image/:location', async (req, res) => {
  try {
    const { location } = req.params;
    console.log('Received request for location:', location);
    
    // Use Pexels API to get a relevant image
    const response = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(location)}&per_page=1`, {
      headers: {
        'Authorization': 'P2zKi2Kk4jeTpd4rw1tiD0BqERvq5eWN6f6aWpvARs7fbPTHMRArikD2' // This is a sample key, you'll need to get your own
      }
    });

    if (response.data.photos && response.data.photos.length > 0) {
      const imageUrl = response.data.photos[0].src.medium;
      console.log('Generated image URL:', imageUrl);
      res.json({ imageUrl });
    } else {
      // Fallback to a generic travel image
      res.json({ imageUrl: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg' });
    }
  } catch (error) {
    console.error('Error getting image:', error);
    // Fallback to a generic travel image
    res.json({ imageUrl: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg' });
  }
});

module.exports = router;