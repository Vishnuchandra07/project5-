import Lead from '../models/Lead.js';
import TeamMember from '../models/TeamMember.js';
import asyncHandler from '../utils/asyncHandler.js';
import { LEAD_STAGES } from '../config/constants.js';

const getMonthRange = (monthsAgo = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0, 23, 59, 59);
  return { start, end };
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const filter = { createdBy: userId };

  const leads = await Lead.find(filter);
  const teamCount = await TeamMember.countDocuments({
    createdBy: userId,
    isActive: true,
  });

  const totalLeads = leads.length;
  const activeDeals = leads.filter(
    (l) => !['Closed Won', 'Closed Lost'].includes(l.stage)
  ).length;
  const closedWon = leads.filter((l) => l.stage === 'Closed Won').length;
  const closedLost = leads.filter((l) => l.stage === 'Closed Lost').length;
  const closedDeals = closedWon + closedLost;
  const totalRevenue = leads
    .filter((l) => l.stage === 'Closed Won')
    .reduce((sum, l) => sum + (l.value || 0), 0);

  const conversionRate =
    closedDeals > 0 ? Math.round((closedWon / closedDeals) * 100) : 0;

  const { start: monthStart, end: monthEnd } = getMonthRange(0);
  const monthlyClosed = leads.filter(
    (l) =>
      l.stage === 'Closed Won' &&
      l.closedAt &&
      l.closedAt >= monthStart &&
      l.closedAt <= monthEnd
  );
  const monthlyRevenue = monthlyClosed.reduce(
    (sum, l) => sum + (l.value || 0),
    0
  );
  const monthlyLeadsCreated = leads.filter(
    (l) => l.createdAt >= monthStart && l.createdAt <= monthEnd
  ).length;

  const stageBreakdown = LEAD_STAGES.reduce((acc, stage) => {
    acc[stage] = leads.filter((l) => l.stage === stage).length;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalLeads,
      activeDeals,
      closedDeals,
      closedWon,
      closedLost,
      totalRevenue,
      conversionRate,
      teamCount,
      monthlyPerformance: {
        leadsCreated: monthlyLeadsCreated,
        dealsClosed: monthlyClosed.length,
        revenue: monthlyRevenue,
      },
      stageBreakdown,
    },
  });
});

// @desc    Get revenue chart data (last 6 months)
// @route   GET /api/dashboard/revenue-chart
// @access  Private
export const getRevenueChart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const months = 6;
  const chartData = [];

  for (let i = months - 1; i >= 0; i--) {
    const { start, end } = getMonthRange(i);
    const monthLabel = start.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    const closedLeads = await Lead.find({
      createdBy: userId,
      stage: 'Closed Won',
      closedAt: { $gte: start, $lte: end },
    });

    const revenue = closedLeads.reduce((sum, l) => sum + (l.value || 0), 0);
    const deals = closedLeads.length;

    const newLeads = await Lead.countDocuments({
      createdBy: userId,
      createdAt: { $gte: start, $lte: end },
    });

    chartData.push({
      month: monthLabel,
      revenue,
      deals,
      newLeads,
    });
  }

  res.json({
    success: true,
    data: chartData,
  });
});

// @desc    Get lead conversion statistics
// @route   GET /api/dashboard/conversion-stats
// @access  Private
export const getConversionStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const leads = await Lead.find({ createdBy: userId });

  const funnel = LEAD_STAGES.map((stage) => ({
    stage,
    count: leads.filter((l) => l.stage === stage).length,
  }));

  const total = leads.length;
  const won = leads.filter((l) => l.stage === 'Closed Won').length;
  const lost = leads.filter((l) => l.stage === 'Closed Lost').length;
  const inProgress = total - won - lost;

  const bySource = leads.reduce((acc, lead) => {
    const source = lead.source || 'Unknown';
    if (!acc[source]) acc[source] = { total: 0, won: 0 };
    acc[source].total += 1;
    if (lead.stage === 'Closed Won') acc[source].won += 1;
    return acc;
  }, {});

  const sourceStats = Object.entries(bySource).map(([source, stats]) => ({
    source,
    total: stats.total,
    won: stats.won,
    conversionRate:
      stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0,
  }));

  res.json({
    success: true,
    data: {
      funnel,
      summary: {
        total,
        won,
        lost,
        inProgress,
        winRate: total > 0 ? Math.round((won / total) * 100) : 0,
      },
      bySource: sourceStats,
    },
  });
});
