const { searchPlaces } = require('../services/yelpService');

exports.getRecommendations = async (req, res, next) => {
  try {
    const {
      lat, lng,
      categories = '',
      price      = '',
      rating     = 0,
      limit      = 10
    } = req.query;

    const places = await searchPlaces({
      latitude:  parseFloat(lat),
      longitude: parseFloat(lng),
      categories,
      price,
      minRating: parseFloat(rating),
      limit:     parseInt(limit)
    });
    res.json(places);
  } catch (err) {
    next(err);
  }
};