const Ticket = require('../models/ticket');
const User = require('../models/user');

// Get department-wise statistics
exports.getDepartmentStats = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          open: {
            $sum: { $cond: [{ $eq: ['$status', 'Open'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          },
          averageResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'Resolved'] },
                { $subtract: ['$resolutionDate', '$createdAt'] },
                null
              ]
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get agent performance metrics
exports.getAgentPerformance = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $match: {
          assignedTo: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          totalAssigned: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          },
          averageResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'Resolved'] },
                { $subtract: ['$resolutionDate', '$createdAt'] },
                null
              ]
            }
          },
          slaCompliance: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'Resolved'] },
                {
                  $cond: [
                    { $lte: ['$resolutionDate', '$slaResolutionDue'] },
                    1,
                    0
                  ]
                },
                null
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $unwind: '$agent'
      },
      {
        $project: {
          agentName: { $concat: ['$agent.firstName', ' ', '$agent.lastName'] },
          totalAssigned: 1,
          resolved: 1,
          averageResolutionTime: 1,
          slaCompliance: 1
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get SLA compliance report
exports.getSLACompliance = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: {
            department: '$department',
            priority: '$priority'
          },
          total: { $sum: 1 },
          withinSLA: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$status', 'Resolved'] },
                    { $eq: ['$status', 'Closed'] }
                  ]
                },
                {
                  $cond: [
                    { $lte: ['$resolutionDate', '$slaResolutionDue'] },
                    1,
                    0
                  ]
                },
                0
              ]
            }
          },
          averageResolutionTime: {
            $avg: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$status', 'Resolved'] },
                    { $eq: ['$status', 'Closed'] }
                  ]
                },
                { $subtract: ['$resolutionDate', '$createdAt'] },
                null
              ]
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ticket trends
exports.getTicketTrends = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let groupBy;

    switch (period) {
      case 'day':
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'week':
        groupBy = { $dateToString: { format: '%Y-%U', date: '$createdAt' } };
        break;
      case 'month':
      default:
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    const trends = await Ticket.aggregate([
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          byStatus: {
            $push: {
              status: '$status',
              count: 1
            }
          },
          byPriority: {
            $push: {
              priority: '$priority',
              count: 1
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 