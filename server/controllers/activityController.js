import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get recent activities
// @route   GET /api/activities
// @access  Private
export const getActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  const filter = { organizationOwner: req.user._id };

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.leadId) {
    filter.lead = req.query.leadId;
  }

  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .populate('performedBy', 'name email avatar')
      .populate('lead', 'companyName stage')
      .populate('teamMember', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Activity.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: activities.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: activities,
  });
});

// @desc    Get activity timeline for a lead
// @route   GET /api/activities/lead/:leadId
// @access  Private
export const getLeadActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({
    organizationOwner: req.user._id,
    lead: req.params.leadId,
  })
    .populate('performedBy', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: activities.length,
    data: activities,
  });
});
