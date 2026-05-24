// routes/calendarNotes.js
const express = require('express');
const router = express.Router();
const CalendarNote = require('../models/CalendarNote');

// GET all calendar notes
router.get('/', async (req, res) => {
  try {
    const notes = await CalendarNote.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single note by YYYY-MM-DD
router.get('/:date', async (req, res) => {
  try {
    const note = await CalendarNote.findOne({ date: req.params.date });
    res.json(note || { date: req.params.date, notes: '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upsert calendar note
router.post('/', async (req, res) => {
  try {
    const { date, notes } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required' });
    
    const updated = await CalendarNote.findOneAndUpdate(
      { date },
      { notes },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
