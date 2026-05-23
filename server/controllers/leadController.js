import Lead from '../models/Lead.js';
import TeamMember from '../models/TeamMember.js';
import asyncHandler from '../utils/asyncHandler.js';
import { LEAD_STAGES } from '../config/constants.js';
import { logActivity } from '../utils/activityLogger.js';
import { recalculateTeamMemberPerformance } from '../utils/teamPerformance.js';

const buildLeadFilter = (query, userId) => {
  const filter = { createdBy: userId };

  if (query.stage) {
    filter.stage = query.stage;
  }

  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      { companyName: searchRegex },
      { contactName: searchRegex },
      { email: searchRegex },
      { industry: searchRegex },
    ];
  }

  return filter;
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = asyncHandler(async (req, res) => {
  const filter = buildLeadFilter(req.query, req.user._id);

  const leads = await Lead.find(filter)
    .populate('assignedTo', 'name email role avatar performance')
    .sort({ updatedAt: -1 });

  res.json({
    success: true,
    count: leads.length,
    data: leads,
  });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  }).populate('assignedTo', 'name email role avatar performance');

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  res.json({
    success: true,
    data: lead,
  });
});

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req, res) => {
  const {
    companyName,
    contactName,
    email,
    phone,
    industry,
    source,
    stage,
    value,
    notes,
    priority,
    assignedTo,
    expectedCloseDate,
  } = req.body;

  if (!companyName || !contactName) {
    res.status(400);
    throw new Error('Company name and contact name are required');
  }

  if (assignedTo) {
    const member = await TeamMember.findOne({
      _id: assignedTo,
      createdBy: req.user._id,
    });
    if (!member) {
      res.status(400);
      throw new Error('Invalid team member assignment');
    }
  }

  const lead = await Lead.create({
    companyName,
    contactName,
    email,
    phone,
    industry,
    source,
    stage: stage || 'New',
    value: value || 0,
    notes,
    priority,
    assignedTo: assignedTo || null,
    expectedCloseDate,
    createdBy: req.user._id,
    ...(stage === 'Closed Won' || stage === 'Closed Lost'
      ? { closedAt: new Date() }
      : {}),
  });

  const populatedLead = await Lead.findById(lead._id).populate(
    'assignedTo',
    'name email role avatar performance'
  );

  if (assignedTo) {
    await recalculateTeamMemberPerformance(assignedTo);
  }

  await logActivity({
    type: 'lead_created',
    message: `Lead created for ${companyName}`,
    performedBy: req.user._id,
    organizationOwner: req.user._id,
    lead: lead._id,
    metadata: { stage: lead.stage },
  });

  res.status(201).json({
    success: true,
    data: populatedLead,
  });
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req, res) => {
  let lead = await Lead.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const previousStage = lead.stage;
  const previousAssignee = lead.assignedTo?.toString();

  if (req.body.assignedTo) {
    const member = await TeamMember.findOne({
      _id: req.body.assignedTo,
      createdBy: req.user._id,
    });
    if (!member) {
      res.status(400);
      throw new Error('Invalid team member assignment');
    }
  }

  const allowedFields = [
    'companyName',
    'contactName',
    'email',
    'phone',
    'industry',
    'source',
    'stage',
    'value',
    'notes',
    'priority',
    'assignedTo',
    'expectedCloseDate',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      lead[field] = req.body[field];
    }
  });

  if (req.body.stage) {
    if (!LEAD_STAGES.includes(req.body.stage)) {
      res.status(400);
      throw new Error('Invalid lead stage');
    }
    if (['Closed Won', 'Closed Lost'].includes(req.body.stage)) {
      lead.closedAt = new Date();
    } else {
      lead.closedAt = null;
    }
  }

  lead = await lead.save();
  lead = await Lead.findById(lead._id).populate(
    'assignedTo',
    'name email role avatar performance'
  );

  const assigneesToUpdate = new Set(
    [previousAssignee, lead.assignedTo?._id?.toString()].filter(Boolean)
  );
  for (const memberId of assigneesToUpdate) {
    await recalculateTeamMemberPerformance(memberId);
  }

  await logActivity({
    type: 'lead_updated',
    message: `Lead updated for ${lead.companyName}`,
    performedBy: req.user._id,
    organizationOwner: req.user._id,
    lead: lead._id,
    metadata: {
      previousStage,
      currentStage: lead.stage,
    },
  });

  if (previousStage !== lead.stage) {
    await logActivity({
      type: 'lead_stage_changed',
      message: `${lead.companyName} moved from ${previousStage} to ${lead.stage}`,
      performedBy: req.user._id,
      organizationOwner: req.user._id,
      lead: lead._id,
      metadata: { from: previousStage, to: lead.stage },
    });
  }

  if (
    previousAssignee !== lead.assignedTo?._id?.toString() &&
    lead.assignedTo
  ) {
    await logActivity({
      type: 'lead_assigned',
      message: `${lead.companyName} assigned to ${lead.assignedTo.name}`,
      performedBy: req.user._id,
      organizationOwner: req.user._id,
      lead: lead._id,
      teamMember: lead.assignedTo._id,
    });
  }

  res.json({
    success: true,
    data: lead,
  });
});

// @desc    Update lead stage (Kanban drag-drop)
// @route   PATCH /api/leads/:id/stage
// @access  Private
export const updateLeadStage = asyncHandler(async (req, res) => {
  const { stage } = req.body;

  if (!stage || !LEAD_STAGES.includes(stage)) {
    res.status(400);
    throw new Error('Valid stage is required');
  }

  let lead = await Lead.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const previousStage = lead.stage;
  lead.stage = stage;

  if (['Closed Won', 'Closed Lost'].includes(stage)) {
    lead.closedAt = new Date();
  } else {
    lead.closedAt = null;
  }

  lead = await lead.save();
  lead = await Lead.findById(lead._id).populate(
    'assignedTo',
    'name email role avatar performance'
  );

  if (lead.assignedTo) {
    await recalculateTeamMemberPerformance(lead.assignedTo._id);
  }

  await logActivity({
    type: 'lead_stage_changed',
    message: `${lead.companyName} moved from ${previousStage} to ${stage}`,
    performedBy: req.user._id,
    organizationOwner: req.user._id,
    lead: lead._id,
    metadata: { from: previousStage, to: stage },
  });

  res.json({
    success: true,
    data: lead,
  });
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const assigneeId = lead.assignedTo;

  await logActivity({
    type: 'lead_deleted',
    message: `Lead deleted for ${lead.companyName}`,
    performedBy: req.user._id,
    organizationOwner: req.user._id,
    metadata: { companyName: lead.companyName },
  });

  await lead.deleteOne();

  if (assigneeId) {
    await recalculateTeamMemberPerformance(assigneeId);
  }

  res.json({
    success: true,
    message: 'Lead removed successfully',
  });
});

// @desc    Get leads grouped by stage (Kanban board)
// @route   GET /api/leads/kanban
// @access  Private
export const getKanbanBoard = asyncHandler(async (req, res) => {
  const filter = { createdBy: req.user._id };

  if (req.query.assignedTo) {
    filter.assignedTo = req.query.assignedTo;
  }

  const leads = await Lead.find(filter)
    .populate('assignedTo', 'name email avatar')
    .sort({ updatedAt: -1 });

  const board = LEAD_STAGES.reduce((acc, stage) => {
    acc[stage] = leads.filter((lead) => lead.stage === stage);
    return acc;
  }, {});

  res.json({
    success: true,
    data: board,
  });
});
