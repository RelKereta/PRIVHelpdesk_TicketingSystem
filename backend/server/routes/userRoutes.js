const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST route to create a new user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, role, departmentId, contactNumber, hireDate, active } = req.body;

    // Create a new user with the provided data
    const user = new User({
      firstName,
      lastName,
      email,
      role,
      departmentId,
      contactNumber,
      hireDate,
      active
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

module.exports = router;
