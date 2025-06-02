const User = require('../models/user');

// Simple authentication middleware
const auth = async (req, res, next) => {
  try {
    // For testing, we'll use a simple header-based auth
    const userId = req.header('X-User-Id');
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Role-based access control
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = {
  auth,
  checkRole
}; 