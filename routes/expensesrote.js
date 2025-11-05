const express = require('express');
const router = express.Router();
const Expense = require('../models/expenses');

// Get all expenses + total
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.render('expenses', { expenses, total });
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Add new expense
router.post('/add', async (req, res) => {
  try {
    const { title, amount, date } = req.body;
    await Expense.create({
      title,
      amount: parseFloat(amount),
      date: date || new Date()
    });
    res.redirect('/expenses');
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).send('Failed to add expense');
  }
});

// Delete expense
router.post('/delete/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.redirect('/expenses');
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).send('Failed to delete expense');
  }
});

module.exports = router;
