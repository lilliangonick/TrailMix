const router         = require('express').Router();
const placeController = require('../controllers/placeController');

router.get('/recommendations', placeController.getRecommendations);

module.exports = router;