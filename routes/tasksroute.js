const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');

// Show all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ deadline: 1 });
    const taskCount = tasks.filter(t => !t.completed).length;
    res.render('tasks', { tasks, taskCount });
  } catch (err) {
    res.status(500).send('Error fetching tasks');
  }
});

// Add a task
router.post('/add', async (req, res) => {
  try {
    const { title, deadline } = req.body;
    await Task.create({ title, deadline });
    res.redirect('/tasks');
  } catch (err) {
    res.status(500).send('Error adding task');
  }
});

// Mark complete
router.post('/complete/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { completed: true });
    res.redirect('/tasks');
  } catch (err) {
    res.status(500).send('Error updating task');
  }
});

// Delete a task
router.post('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

module.exports = router;
