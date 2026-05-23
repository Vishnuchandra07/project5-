import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import KanbanBoard from '../components/pipeline/KanbanBoard';
import PipelineToolbar from '../components/pipeline/PipelineToolbar';
import { LEAD_STAGES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { getKanbanBoard } from '../services/leadService';
import { getTeamMembers } from '../services/teamService';

const filterBoard = (board, search, stageFilter) => {
  const term = search.trim().toLowerCase();
  const filtered = {};

  LEAD_STAGES.forEach((stage) => {
    if (stageFilter && stage !== stageFilter) {
      filtered[stage] = [];
      return;
    }

    let leads = board[stage] || [];

    if (term) {
      leads = leads.filter(
        (l) =>
          l.companyName?.toLowerCase().includes(term) ||
          l.contactName?.toLowerCase().includes(term) ||
          l.email?.toLowerCase().includes(term) ||
          l.assignedTo?.name?.toLowerCase().includes(term)
      );
    }

    filtered[stage] = leads;
  });

  return filtered;
};

const Pipeline = () => {
  const [board, setBoard] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchBoard = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      try {
        const params = assignedTo ? { assignedTo } : {};
        const res = await getKanbanBoard(params);
        setBoard(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load pipeline');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [assignedTo]
  );

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  useEffect(() => {
    getTeamMembers({ isActive: 'true' })
      .then((res) => setTeamMembers(res.data))
      .catch(() => {});
  }, []);

  const filteredBoard = useMemo(
    () => filterBoard(board, search, stageFilter),
    [board, search, stageFilter]
  );

  const totalLeads = useMemo(
    () =>
      LEAD_STAGES.reduce((sum, stage) => sum + (filteredBoard[stage]?.length || 0), 0),
    [filteredBoard]
  );

  const totalValue = useMemo(
    () =>
      LEAD_STAGES.reduce(
        (sum, stage) =>
          sum +
          (filteredBoard[stage] || []).reduce((s, l) => s + (l.value || 0), 0),
        0
      ),
    [filteredBoard]
  );

  const hasAnyLeads = LEAD_STAGES.some((s) => (board[s]?.length || 0) > 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pipeline board"
        description="Move deals across stages — changes save when you drop a card"
        action={
          <Link to="/leads" className="btn-primary">
            <FiPlus className="h-4 w-4" />
            Add lead
          </Link>
        }
      />

      <PipelineToolbar
        assignedTo={assignedTo}
        onAssigneeChange={setAssignedTo}
        teamMembers={teamMembers}
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
        totalLeads={totalLeads}
        totalValueLabel={totalValue > 0 ? formatCurrency(totalValue) : ''}
        onRefresh={() => fetchBoard(true)}
        refreshing={refreshing}
      />

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[480px] items-center justify-center rounded-xl border border-surface-200 bg-white">
          <Spinner size="lg" />
        </div>
      ) : !hasAnyLeads ? (
        <div className="rounded-xl border border-surface-200 bg-white p-6">
          <EmptyState
            title="Pipeline is empty"
            description="Create leads to see them on the board. You can drag cards between columns to update stages."
            action={
              <Link to="/leads" className="btn-primary">
                <FiPlus className="h-4 w-4" />
                Create first lead
              </Link>
            }
          />
          <div className="mt-8 opacity-40 pointer-events-none select-none">
            <KanbanBoard board={{}} onUpdate={fetchBoard} />
          </div>
        </div>
      ) : totalLeads === 0 && (search || stageFilter) ? (
        <div className="card py-16 text-center">
          <p className="text-sm text-slate-500">No leads match your filters</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStageFilter('');
            }}
            className="btn-secondary mt-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-surface-200 bg-gradient-to-b from-surface-100/80 to-surface-50 p-3 sm:p-4">
          <KanbanBoard board={filteredBoard} onUpdate={() => fetchBoard(true)} />
        </div>
      )}
    </div>
  );
};

export default Pipeline;
