// routes/exams.js
const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// GET all modules
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single module by id
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: 'Module not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new module
router.post('/', async (req, res) => {
  try {
    const { moduleCode, moduleName, credits, type, date, pastPapers, dailyPlan, completed, description } = req.body;
    const newExam = new Exam({
      moduleCode,
      moduleName,
      credits,
      type,
      date,
      pastPapers,
      dailyPlan,
      completed,
      description
    });
    const saved = await newExam.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update existing module
router.put('/:id', async (req, res) => {
  try {
    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Module not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH toggle the module study completed checklist
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { completed } = req.body;
    const updated = await Exam.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Module not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH toggle a specific past paper's completion state
router.patch('/:id/pastpaper/:year', async (req, res) => {
  try {
    const { id, year } = req.params;
    const { completed } = req.body;
    
    const module = await Exam.findById(id);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    
    const paper = module.pastPapers.find(p => p.year === year);
    if (paper) {
      paper.completed = completed;
    } else {
      module.pastPapers.push({ year, completed });
    }
    
    await module.save();
    res.json(module);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE module
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Exam.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Module not found' });
    res.json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
