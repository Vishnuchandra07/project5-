import Lead from '../models/Lead.js';
import TeamMember from '../models/TeamMember.js';

export const recalculateTeamMemberPerformance = async (teamMemberId) => {
  const member = await TeamMember.findById(teamMemberId);
  if (!member) return;

  const leads = await Lead.find({ assignedTo: teamMemberId });

  const totalLeads = leads.length;
  const activeDeals = leads.filter(
    (l) => !['Closed Won', 'Closed Lost'].includes(l.stage)
  ).length;
  const closedWon = leads.filter((l) => l.stage === 'Closed Won').length;
  const closedLost = leads.filter((l) => l.stage === 'Closed Lost').length;
  const closedTotal = closedWon + closedLost;
  const conversionRate =
    closedTotal > 0 ? Math.round((closedWon / closedTotal) * 100) : 0;
  const totalRevenue = leads
    .filter((l) => l.stage === 'Closed Won')
    .reduce((sum, l) => sum + (l.value || 0), 0);

  member.performance = {
    totalLeads,
    activeDeals,
    closedWon,
    closedLost,
    conversionRate,
    totalRevenue,
  };

  await member.save();
};
