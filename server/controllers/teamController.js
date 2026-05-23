import TeamMember from '../models/TeamMember.js';
import Lead from '../models/Lead.js';
import asyncHandler from '../utils/asyncHandler.js';
import { logActivity } from '../utils/activityLogger.js';
import { recalculateTeamMemberPerformance } from '../utils/teamPerformance.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Private
export const getTeamMembers = asyncHandler(async (req, res) => {
  const filter = { createdBy: req.user._id };

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const members = await TeamMember.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: members.length,
    data: members,
  });
});

// @desc    Get single team member with assigned leads
// @route   GET /api/team/:id
// @access  Private
export const getTeamMemberById = asyncHandler(async (req, res) => {
  const member = await TeamMember.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  await recalculateTeamMemberPerformance(member._id);

  const updatedMember = await TeamMember.findById(member._id);
  const assignedLeads = await Lead.find({
    assignedTo: member._id,
    createdBy: req.user._id,
  }).sort({ updatedAt: -1 });

  res.json({
    success: true,
    data: {
      member: updatedMember,
      assignedLeads,
    },
  });
});

// @desc    Add team member
// @route   POST /api/team
// @access  Private
export const createTeamMember = asyncHandler(async (req, res) => {
  const { name, email, phone, role, department, avatar } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error('Name and email are required');
  }

  const existing = await TeamMember.findOne({
    email,
    createdBy: req.user._id,
  });

  if (existing) {
    res.status(400);
    throw new Error('Team member with this email already exists');
  }

  const member = await TeamMember.create({
    name,
    email,
    phone,
    role,
    department,
    avatar,
    createdBy: req.user._id,
  });

  await logActivity({
    type: 'team_member_added',
    message: `Team member ${name} was added`,
    performedBy: req.user._id,
    organizationOwner: req.user._id,
    teamMember: member._id,
  });

  res.status(201).json({
    success: true,
    data: member,
  });
});

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
export const updateTeamMember = asyncHandler(async (req, res) => {
  let member = await TeamMember.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  const allowedFields = [
    'name',
    'email',
    'phone',
    'role',
    'department',
    'avatar',
    'isActive',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      member[field] = req.body[field];
    }
  });

  member = await member.save();

  await logActivity({
    type: 'team_member_updated',
    message: `Team member ${member.name} was updated`,
    performedBy: req.user._id,
    organizationOwner: req.user._id,
    teamMember: member._id,
  });

  res.json({
    success: true,
    data: member,
  });
});

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!member) {
    res.status(404);
    throw new Error('Team member not found');
  }

  await Lead.updateMany(
    { assignedTo: member._id },
    { $set: { assignedTo: null } }
  );

  await member.deleteOne();

  res.json({
    success: true,
    message: 'Team member removed successfully',
  });
});

// @desc    Get team performance summary
// @route   GET /api/team/performance/summary
// @access  Private
export const getTeamPerformanceSummary = asyncHandler(async (req, res) => {
  const members = await TeamMember.find({
    createdBy: req.user._id,
    isActive: true,
  });

  for (const member of members) {
    await recalculateTeamMemberPerformance(member._id);
  }

  const updatedMembers = await TeamMember.find({
    createdBy: req.user._id,
    isActive: true,
  }).select('name email role avatar performance');

  const totals = updatedMembers.reduce(
    (acc, m) => {
      acc.totalLeads += m.performance.totalLeads;
      acc.activeDeals += m.performance.activeDeals;
      acc.closedWon += m.performance.closedWon;
      acc.closedLost += m.performance.closedLost;
      acc.totalRevenue += m.performance.totalRevenue;
      return acc;
    },
    {
      totalLeads: 0,
      activeDeals: 0,
      closedWon: 0,
      closedLost: 0,
      totalRevenue: 0,
    }
  );

  const closedTotal = totals.closedWon + totals.closedLost;
  totals.conversionRate =
    closedTotal > 0 ? Math.round((totals.closedWon / closedTotal) * 100) : 0;

  res.json({
    success: true,
    data: {
      members: updatedMembers,
      totals,
    },
  });
});
