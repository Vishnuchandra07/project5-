import {
  FiActivity,
  FiTarget,
  FiUsers,
  FiArrowRight,
} from 'react-icons/fi';
import { formatRelativeTime } from '../../utils/formatters';
import EmptyState from '../ui/EmptyState';

const typeIcons = {
  lead_created: FiTarget,
  lead_updated: FiTarget,
  lead_deleted: FiTarget,
  lead_stage_changed: FiArrowRight,
  lead_assigned: FiTarget,
  team_member_added: FiUsers,
  team_member_updated: FiUsers,
};

const typeColors = {
  lead_created: 'bg-emerald-50 text-emerald-600',
  lead_updated: 'bg-blue-50 text-blue-600',
  lead_deleted: 'bg-rose-50 text-rose-600',
  lead_stage_changed: 'bg-purple-50 text-purple-600',
  lead_assigned: 'bg-amber-50 text-amber-600',
  team_member_added: 'bg-brand-50 text-brand-600',
  team_member_updated: 'bg-slate-100 text-slate-600',
};

const ActivityFeed = ({ activities }) => {
  if (!activities?.length) {
    return (
      <EmptyState
        icon={FiActivity}
        title="No activities yet"
        description="Actions on leads and team members will appear in your timeline"
      />
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-surface-200" />
      <ul className="space-y-6">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type] || FiActivity;
          const colorClass = typeColors[activity.type] || 'bg-surface-100 text-slate-600';

          return (
            <li key={activity._id} className="relative flex gap-4 pl-1">
              <div
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorClass}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <p className="text-sm text-surface-800">{activity.message}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                  <span className="font-medium text-slate-600">
                    {activity.performedBy?.name || 'System'}
                  </span>
                  <span>·</span>
                  <time>{formatRelativeTime(activity.createdAt)}</time>
                  {activity.lead?.companyName && (
                    <>
                      <span>·</span>
                      <span className="text-brand-600">{activity.lead.companyName}</span>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ActivityFeed;
