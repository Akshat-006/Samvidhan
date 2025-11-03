const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

// Update CORS configuration for development
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'null'],  // Allow multiple origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser and useUnifiedTopology are deprecated in latest drivers
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/questions', require('./routes/questions'));
app.use('/departments', require('./routes/departments'));

app.get('/', (req, res) => {
  res.send('Parliament Question Management Backend');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
