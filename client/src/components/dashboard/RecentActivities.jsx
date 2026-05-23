import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiTarget,
  FiUsers,
  FiArrowRight,
  FiTrash2,
} from 'react-icons/fi';
import { formatRelativeTime } from '../../utils/formatters';
import EmptyState from '../ui/EmptyState';

const typeConfig = {
  lead_created: { icon: FiTarget, className: 'bg-emerald-50 text-emerald-600' },
  lead_updated: { icon: FiTarget, className: 'bg-blue-50 text-blue-600' },
  lead_deleted: { icon: FiTrash2, className: 'bg-rose-50 text-rose-600' },
  lead_stage_changed: { icon: FiArrowRight, className: 'bg-purple-50 text-purple-600' },
  lead_assigned: { icon: FiTarget, className: 'bg-amber-50 text-amber-600' },
  team_member_added: { icon: FiUsers, className: 'bg-brand-50 text-brand-600' },
  team_member_updated: { icon: FiUsers, className: 'bg-slate-100 text-slate-600' },
};

const RecentActivities = ({ activities, compact = false }) => {
  if (!activities?.length) {
    return (
      <EmptyState
        icon={FiActivity}
        title="No activities yet"
        description="Lead updates and team actions will appear here"
        action={
          <Link to="/leads" className="btn-primary text-sm">
            Create a lead
          </Link>
        }
      />
    );
  }

  return (
    <ul className={compact ? 'space-y-0' : 'divide-y divide-surface-100'}>
      {activities.map((activity, index) => {
        const config = typeConfig[activity.type] || {
          icon: FiActivity,
          className: 'bg-surface-100 text-slate-600',
        };
        const Icon = config.icon;

        return (
          <li
            key={activity._id}
            className={`flex gap-3 ${compact ? 'py-3' : 'py-3.5'} ${
              index === 0 ? 'pt-0' : ''
            } ${index === activities.length - 1 ? 'pb-0' : ''}`}
          >
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.className}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-surface-800 line-clamp-2">
                {activity.message}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
                <span className="font-medium text-slate-600">
                  {activity.performedBy?.name || 'System'}
                </span>
                <span aria-hidden>·</span>
                <time dateTime={activity.createdAt}>
                  {formatRelativeTime(activity.createdAt)}
                </time>
                {activity.lead?.companyName && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="truncate text-brand-600">
                      {activity.lead.companyName}
                    </span>
                  </>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RecentActivities;
