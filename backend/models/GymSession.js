// models/GymSession.js
const mongoose = require('mongoose');

const GymSessionSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required: true },
  time: { type: String, required: true }, // e.g., "18:00"
  activity: { type: String, default: 'Gym' },
  completed: { type: Boolean, default: false },
  notes: { type: String }
});

module.exports = mongoose.model('GymSession', GymSessionSchema);
