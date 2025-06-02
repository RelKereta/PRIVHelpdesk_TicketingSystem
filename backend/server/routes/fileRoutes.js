const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Upload file
router.post('/upload', fileController.upload.single('file'), fileController.uploadFile);

// Get file
router.get('/:filename', fileController.getFile);

// Delete file
router.delete('/:filename', fileController.deleteFile);

module.exports = router; 