// models/Exam.js
const mongoose = require('mongoose');

const PastPaperSchema = new mongoose.Schema({
  year: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const ExamSchema = new mongoose.Schema({
  moduleCode: { type: String, required: true },
  moduleName: { type: String, required: true },
  credits: { type: Number, default: 2 },
  type: { type: String, enum: ['Theory Only', 'Practical Only', 'Theory & Practical'], default: 'Theory Only' },
  date: { type: Date, required: true },
  pastPapers: { type: [PastPaperSchema], default: [
    { year: '2021', completed: false },
    { year: '2022', completed: false },
    { year: '2023', completed: false },
    { year: '2024', completed: false }
  ]},
  dailyPlan: { type: String, default: '' },
  completed: { type: Boolean, default: false }, // Study session checklist
  description: { type: String }
});

module.exports = mongoose.model('Exam', ExamSchema);
