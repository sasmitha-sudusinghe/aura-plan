// models/CalendarNote.js
const mongoose = require('mongoose');

const CalendarNoteSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format "YYYY-MM-DD"
  notes: { type: String, default: '' }
});

module.exports = mongoose.model('CalendarNote', CalendarNoteSchema);
