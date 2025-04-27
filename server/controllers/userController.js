const User = require('../models/User');

exports.checkUser = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const user = await User.findOne({ email }).select('_id email');

    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking user existence:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
