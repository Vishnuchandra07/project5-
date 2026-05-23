import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import ActivityFeed from '../components/activities/ActivityFeed';
import { getActivities } from '../services/activityService';

const ACTIVITY_TYPES = [
  { value: '', label: 'All types' },
  { value: 'lead_created', label: 'Lead created' },
  { value: 'lead_updated', label: 'Lead updated' },
  { value: 'lead_stage_changed', label: 'Stage changed' },
  { value: 'lead_assigned', label: 'Lead assigned' },
  { value: 'lead_deleted', label: 'Lead deleted' },
  { value: 'team_member_added', label: 'Member added' },
  { value: 'team_member_updated', label: 'Member updated' },
];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getActivities({
          limit: 15,
          page,
          ...(type && { type }),
        });
        setActivities(res.data);
        setPages(res.pages || 1);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [type, page]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Timeline"
        description="Track all lead updates, assignments, and team changes"
      />

      <div className="card flex flex-wrap items-end gap-4 py-4">
        <div className="w-full sm:w-56">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            Filter by type
          </label>
          <select
            className="input-field"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="card">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <ActivityFeed activities={activities} />
        )}

        {pages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-surface-100 pt-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {pages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
