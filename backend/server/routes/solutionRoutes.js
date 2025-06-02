const express = require('express');
const router = express.Router();

// Mock solutions data for now
const mockSolutions = [
  {
    _id: '1',
    title: 'Password Reset Guide',
    description: 'Step-by-step guide to reset your password for various company systems.',
    category: 'Account Management',
    views: 245,
    createdAt: new Date('2024-01-15'),
    content: 'Detailed instructions for password reset...'
  },
  {
    _id: '2',
    title: 'VPN Setup Instructions',
    description: 'How to configure and connect to the company VPN from different devices.',
    category: 'Network',
    views: 189,
    createdAt: new Date('2024-01-10'),
    content: 'Complete VPN setup guide...'
  },
  {
    _id: '3',
    title: 'Email Configuration',
    description: 'Setting up company email on various email clients and mobile devices.',
    category: 'Software',
    views: 156,
    createdAt: new Date('2024-01-08'),
    content: 'Email configuration steps...'
  },
  {
    _id: '4',
    title: 'Printer Troubleshooting',
    description: 'Common printer issues and their solutions.',
    category: 'Hardware',
    views: 134,
    createdAt: new Date('2024-01-05'),
    content: 'Printer troubleshooting guide...'
  },
  {
    _id: '5',
    title: 'Software Installation Requests',
    description: 'How to request and install approved software on company devices.',
    category: 'Software',
    views: 98,
    createdAt: new Date('2024-01-03'),
    content: 'Software installation procedure...'
  }
];

// Get all solutions
router.get('/', (req, res) => {
  try {
    res.json(mockSolutions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching solutions', error: error.message });
  }
});

// Get a single solution by ID
router.get('/:id', (req, res) => {
  try {
    const solution = mockSolutions.find(s => s._id === req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    // Increment view count (in a real app, this would update the database)
    solution.views += 1;
    
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching solution', error: error.message });
  }
});

// Create a new solution (admin only)
router.post('/', (req, res) => {
  try {
    // In a real app, you would check user permissions here
    const { title, description, category, content } = req.body;
    
    const newSolution = {
      _id: String(mockSolutions.length + 1),
      title,
      description,
      category,
      content,
      views: 0,
      createdAt: new Date()
    };
    
    mockSolutions.push(newSolution);
    res.status(201).json(newSolution);
  } catch (error) {
    res.status(500).json({ message: 'Error creating solution', error: error.message });
  }
});

// Update a solution (admin only)
router.put('/:id', (req, res) => {
  try {
    const solutionIndex = mockSolutions.findIndex(s => s._id === req.params.id);
    if (solutionIndex === -1) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    const updatedSolution = {
      ...mockSolutions[solutionIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    mockSolutions[solutionIndex] = updatedSolution;
    res.json(updatedSolution);
  } catch (error) {
    res.status(500).json({ message: 'Error updating solution', error: error.message });
  }
});

// Delete a solution (admin only)
router.delete('/:id', (req, res) => {
  try {
    const solutionIndex = mockSolutions.findIndex(s => s._id === req.params.id);
    if (solutionIndex === -1) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    mockSolutions.splice(solutionIndex, 1);
    res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting solution', error: error.message });
  }
});

module.exports = router; 