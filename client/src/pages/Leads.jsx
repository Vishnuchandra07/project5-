import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import PageHeader from '../components/ui/PageHeader';
import Alert from '../components/ui/Alert';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import LeadCardList from '../components/leads/LeadCardList';
import LeadFormModal from '../components/leads/LeadFormModal';
import LeadStatsBar from '../components/leads/LeadStatsBar';
import { emptyLeadForm, leadToForm } from '../components/leads/LeadForm';
import { useDebounce } from '../hooks/useDebounce';
import { useLeads } from '../hooks/useLeads';
import { getTeamMembers } from '../services/teamService';

const Leads = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const {
    leads,
    loading,
    error,
    success,
    setError,
    setSuccess,
    clearMessages,
    fetchLeads,
    addLead,
    editLead,
    removeLead,
  } = useLeads();

  const [teamMembers, setTeamMembers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const defaultStage = location.state?.defaultStage || '';

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    stage: defaultStage,
    assignedTo: '',
    priority: '',
  });
  const debouncedSearch = useDebounce(filters.search);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [form, setForm] = useState(emptyLeadForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const hasActiveFilters = Boolean(
    filters.search || filters.stage || filters.assignedTo || filters.priority
  );

  const loadLeads = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      clearMessages();

      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.stage) params.stage = filters.stage;
      if (filters.assignedTo) params.assignedTo = filters.assignedTo;
      if (filters.priority) params.priority = filters.priority;

      try {
        await fetchLeads(params, { silent: isRefresh });
      } finally {
        if (isRefresh) setRefreshing(false);
      }
    },
    [
      debouncedSearch,
      filters.stage,
      filters.assignedTo,
      filters.priority,
      fetchLeads,
      clearMessages,
    ]
  );

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    getTeamMembers({ isActive: 'true' })
      .then((res) => setTeamMembers(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (defaultStage) {
      setForm((f) => ({ ...f, stage: defaultStage }));
    }
  }, [defaultStage]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  const openCreate = () => {
    setEditingLead(null);
    setForm({ ...emptyLeadForm, stage: defaultStage || 'New' });
    setModalOpen(true);
    clearMessages();
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setForm(leadToForm(lead));
    setModalOpen(true);
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingLead) {
        await editLead(editingLead._id, form);
      } else {
        await addLead(form);
      }
      setModalOpen(false);
      loadLeads();
    } catch {
      /* error in hook */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeLead(deleteTarget._id);
      setDeleteTarget(null);
    } catch {
      /* error in hook */
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', stage: '', assignedTo: '', priority: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Manage enquiries and deals for your BD team"
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadLeads(true)}
              disabled={refreshing}
              className="btn-secondary"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button type="button" onClick={openCreate} className="btn-primary">
              <FiPlus className="h-4 w-4" />
              Add lead
            </button>
          </div>
        }
      />

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <LeadFilters
        filters={filters}
        onChange={setFilters}
        teamMembers={teamMembers}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {!loading && leads.length > 0 && <LeadStatsBar leads={leads} />}

      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-surface-200 bg-white">
          <Spinner size="lg" />
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No leads match filters' : 'No leads yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Create your first lead to start tracking opportunities'
          }
          action={
            hasActiveFilters ? (
              <button type="button" onClick={clearFilters} className="btn-secondary">
                Clear filters
              </button>
            ) : (
              <button type="button" onClick={openCreate} className="btn-primary">
                <FiPlus className="h-4 w-4" />
                Add lead
              </button>
            )
          }
        />
      ) : (
        <>
          <LeadTable
            leads={leads}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onStageChange={() => loadLeads(true)}
          />
          <div className="md:hidden">
            <LeadCardList leads={leads} onEdit={openEdit} onDelete={setDeleteTarget} />
          </div>
        </>
      )}

      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLead ? 'Edit lead' : 'Create lead'}
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        teamMembers={teamMembers}
        saving={saving}
        submitLabel={editingLead ? 'Update lead' : 'Create lead'}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete lead"
        message={`Are you sure you want to delete "${deleteTarget?.companyName}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default Leads;
