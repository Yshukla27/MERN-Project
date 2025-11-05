const express = require('express');
const router = express.Router();
const Habit = require('../models/habits');

// Show all habits
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.render('habits', { habits });
  } catch (err) {
    res.status(500).send('Error fetching habits');
  }
});

// Add new habit
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name.trim()) return res.redirect('/habits');
    await Habit.create({ name, daysPerformed: 0 });
    res.redirect('/habits');
  } catch (err) {
    res.status(500).send('Error adding habit');
  }
});

// Increment performance counter
router.post('/increment/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    habit.daysPerformed += 1;
    await habit.save();
    res.redirect('/habits');
  } catch (err) {
    res.status(500).send('Error incrementing habit');
  }
});

// Edit habit name
router.post('/edit/:id', async (req, res) => {
  try {
    const { updatedName } = req.body;
    await Habit.findByIdAndUpdate(req.params.id, { name: updatedName });
    res.redirect('/habits');
  } catch (err) {
    res.status(500).send('Error editing habit');
  }
});

// Delete habit
router.post('/delete/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.redirect('/habits');
  } catch (err) {
    res.status(500).send('Error deleting habit');
  }
});

module.exports = router;
