const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionText: { type: String, required: true },
  keywords: [String],
  department: { type: String, required: true },
  file: { type: String },
  status: { type: String, enum: ['pending', 'reviewed', 'approved'], default: 'pending' }
});
module.exports = mongoose.model('Question', questionSchema);
