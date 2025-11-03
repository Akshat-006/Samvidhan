
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const path = require('path');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use env var in production

// Configure multer for profile photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG and PNG files are allowed'));
    }
  }
});


// Signup
router.post('/signup', async (req, res) => {
  const { username, password, role, firstName, lastName, email, age, gender } = req.body;
  if (!username || !password || !firstName || !lastName || !email || !age || !gender) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({ 
        message: existing.username === username ? 'Username already exists' : 'Email already exists' 
      });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashed,
      role,
      firstName,
      lastName,
      email,
      age,
      gender,
      profilePhoto: req.file ? req.file.filename : null
    });
    
    await user.save();
    res.status(201).json({
      message: 'User registered',
      user: {
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
	try {
		const user = await User.findOne({ username });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(401).json({ message: 'Invalid credentials' });
		const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
		res.json({ token, role: user.role, user: { username: user.username, role: user.role } });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
