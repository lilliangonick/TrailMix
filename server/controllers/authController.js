const bcrypt = require('bcryptjs'); // to encrypt password
const jwt = require('jsonwebtoken'); // creates tokens 
const User = require('../models/User'); // user object 

const JWT_SECRET = process.env.JWT_SECRET;

// register a user
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists through email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Username taken' });
    }

    // password checking
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialChar) {
        return res.status(400).json({ message: 'Password must contain at least one special character' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // save into database
    await newUser.save();

    // if user created, send success message
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find the user through email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Found user:', user);

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password match:', isMatch);

    // create a JWT toke
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // return token for client side
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
