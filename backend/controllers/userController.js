const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.updatePassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.findByIdAndUpdate(userId, { password: hashedPassword });

    if (!result) return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};
