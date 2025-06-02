const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, checkRole } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get department-wise statistics
router.get('/department-stats', checkRole(['admin', 'agent']), analyticsController.getDepartmentStats);

// Get agent performance metrics
router.get('/agent-performance', checkRole(['admin']), analyticsController.getAgentPerformance);

// Get SLA compliance report
router.get('/sla-compliance', checkRole(['admin', 'agent']), analyticsController.getSLACompliance);

// Get ticket trends
router.get('/ticket-trends', checkRole(['admin', 'agent']), analyticsController.getTicketTrends);

module.exports = router; 