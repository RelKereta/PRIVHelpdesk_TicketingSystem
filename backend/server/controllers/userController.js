const User = require('../models/user');

// Register a new user
exports.register = async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    
    const user = new User(req.body);
    console.log('Created user object:', user);
    
    const savedUser = await user.save();
    console.log('Saved user to database:', savedUser);
    
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    const user = await User.findOne({ email });
    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'email', 'bio', 'profilePicture'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get agents and admins (accessible by agents and admins)
exports.getAgentsAndAdmins = async (req, res) => {
  try {
    // If we're here through the auth middleware, req.user should exist
    // But let's add extra safety checks
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Authentication required. Please log in to access this resource.',
        code: 'NO_USER_ID'
      });
    }

    const requestingUser = await User.findById(userId);
    if (!requestingUser) {
      return res.status(401).json({ 
        message: 'User not found. Please log in again.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if the requesting user is an agent or admin
    if (!['agent', 'admin'].includes(requestingUser.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Only agents and administrators can access this resource.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const users = await User.find({ role: { $in: ['agent', 'admin'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching agents and admins:', error);
    res.status(500).json({ 
      message: 'Internal server error while fetching agents and admins',
      error: error.message,
      code: 'INTERNAL_ERROR'
    });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove password from updates for security
    delete updates.password;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username/email already exists (if being updated)
    if (updates.username && updates.username !== user.username) {
      const existingUser = await User.findOne({ username: updates.username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user fields
    Object.keys(updates).forEach(key => {
      user[key] = updates[key];
    });

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 