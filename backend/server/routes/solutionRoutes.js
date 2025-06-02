const express = require('express');
const router = express.Router();
const Solution = require('../models/solution');
const { checkRole, auth } = require('../middleware/auth');

// Get all solutions
router.get('/', async (req, res) => {
  try {
    const solutions = await Solution.find()
      .select('-content') // Don't send full content in list view
      .sort({ createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching solutions', error: error.message });
  }
});

// Get a single solution by ID
router.get('/:id', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    // Increment view count
    solution.views += 1;
    await solution.save();
    
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching solution', error: error.message });
  }
});

// Create a new solution (admin/agent only)
router.post('/', auth, checkRole(['admin', 'agent']), async (req, res) => {
  try {
    const { title, description, category, content } = req.body;
    
    const newSolution = new Solution({
      title,
      description,
      category,
      content,
      createdBy: req.user._id
    });
    
    await newSolution.save();
    res.status(201).json(newSolution);
  } catch (error) {
    res.status(500).json({ message: 'Error creating solution', error: error.message });
  }
});

// Update a solution (admin/agent only)
router.put('/:id', auth, checkRole(['admin', 'agent']), async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    const updatedSolution = await Solution.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastUpdatedBy: req.user._id
      },
      { new: true }
    );
    
    res.json(updatedSolution);
  } catch (error) {
    res.status(500).json({ message: 'Error updating solution', error: error.message });
  }
});

// Delete a solution (admin/agent only)
router.delete('/:id', auth, checkRole(['admin', 'agent']), async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    await solution.deleteOne();
    res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting solution', error: error.message });
  }
});

module.exports = router; 