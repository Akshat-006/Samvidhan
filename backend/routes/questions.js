const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
    }
  }
});

// Upload a new question
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { questionText, keywords, department } = req.body;
    const question = new Question({
      user: req.user.id,
      questionText,
      keywords: keywords.split(',').map(k => k.trim()),
      department,
      file: req.file ? req.file.filename : null,
      status: 'pending'
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading question' });
  }
});

// Get all questions (for admin) with answers
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const questions = await Question.find().populate('user', 'username');
    // Fetch answers for each question
    const questionsWithAnswers = await Promise.all(questions.map(async (q) => {
      const answer = await Answer.findOne({ question: q._id });
      return { ...q.toObject(), answer: answer ? answer.answerText : '' };
    }));
    res.json(questionsWithAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get user's questions with answers
router.get('/my', auth, async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user.id });
    const questionsWithAnswers = await Promise.all(questions.map(async (q) => {
      const answer = await Answer.findOne({ question: q._id });
      return { ...q.toObject(), answer: answer ? answer.answerText : '' };
    }));
    res.json(questionsWithAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Update question status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { status } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error updating question status' });
  }
});

// Admin answers a question (create or update answer)
const mongoose = require('mongoose');
router.put('/:id/answer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { answer } = req.body;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    // Upsert answer
    const answerDoc = await Answer.findOneAndUpdate(
      { question: id },
      { answerText: answer, admin: req.user.id },
      { new: true, upsert: true }
    );
    res.json({ message: 'Answer saved', answer: answerDoc.answerText });
  } catch (error) {
    res.status(500).json({ message: 'Error saving answer' });
  }
});

module.exports = router;
