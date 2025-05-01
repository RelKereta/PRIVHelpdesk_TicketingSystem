const mongoose = require('mongoose');

const user1Schema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        required: true
    },
    departmentId: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    hireDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true
    }
});

const User1 = mongoose.model('User1', user1Schema);

module.exports = User1; 