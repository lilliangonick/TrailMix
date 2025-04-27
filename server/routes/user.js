const express = require('express');
const { checkUser } = require('../controllers/userController');
const router = express.Router();

// GET /api/users/check/:email
router.get('/check/:email', checkUser);

module.exports = router;
