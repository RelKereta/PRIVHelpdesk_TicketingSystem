const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Helper function to generate the password
const generatePassword = (hireDate) => {
  const year = new Date(hireDate).getFullYear();
  const lastTwoDigitsOfYear = year % 100;
  return `m4nD!r1.${lastTwoDigitsOfYear}`;
};

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  departmentId: { type: Number, required: true },
  contactNumber: { type: String },
  hireDate: { type: Date, required: true },
  active: { type: Boolean, default: true }
});

// Pre-save hook to auto-generate the password
userSchema.pre('save', async function(next) {
  if (!this.password) {
    this.password = generatePassword(this.hireDate);
  }

  // Encrypt the password before saving
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare passwords
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
