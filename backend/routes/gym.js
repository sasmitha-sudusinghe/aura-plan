// routes/gym.js
const express = require('express');
const router = express.Router();
const GymSession = require('../models/GymSession');

// GET all gym sessions
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.day) filter.day = req.query.day;
    const sessions = await GymSession.find(filter);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single session by id
router.get('/:id', async (req, res) => {
  try {
    const session = await GymSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new gym session
router.post('/', async (req, res) => {
  try {
    const { day, time, activity, completed, notes } = req.body;
    const newSession = new GymSession({ day, time, activity, completed, notes });
    const saved = await newSession.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update existing session
router.put('/:id', async (req, res) => {
  try {
    const updated = await GymSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Session not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH toggle gym session completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { completed } = req.body;
    const updated = await GymSession.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Session not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a gym session
router.delete('/:id', async (req, res) => {
  try {
    const removed = await GymSession.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
