import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiDollarSign,
} from 'react-icons/fi';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LeadFormModal from '../components/leads/LeadFormModal';
import ActivityFeed from '../components/activities/ActivityFeed';
import { emptyLeadForm, leadToForm } from '../components/leads/LeadForm';
import { useLeads } from '../hooks/useLeads';
import { getLeadActivities } from '../services/activityService';
import { getTeamMembers } from '../services/teamService';
import { formatCurrency, formatDate } from '../utils/formatters';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchLead, editLead, removeLead, loading, error, success, setError, setSuccess } =
    useLeads();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyLeadForm);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadLead = useCallback(async () => {
    try {
      const data = await fetchLead(id);
      setLead(data);
      setForm(leadToForm(data));
    } catch {
      /* error set in hook */
    }
  }, [id, fetchLead]);

  const loadActivities = useCallback(async () => {
    try {
      const res = await getLeadActivities(id);
      setActivities(res.data);
    } catch {
      /* non-critical */
    }
  }, [id]);

  useEffect(() => {
    loadLead();
    loadActivities();
    getTeamMembers({ isActive: 'true' })
      .then((res) => setTeamMembers(res.data))
      .catch(() => {});
  }, [loadLead, loadActivities]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await editLead(id, form);
      setLead(updated);
      setModalOpen(false);
      loadActivities();
    } catch {
      /* handled in hook */
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeLead(id);
      navigate('/leads');
    } catch {
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !lead) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!lead && !loading) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error || 'Lead not found'} />
        <Link to="/leads" className="btn-secondary inline-flex">
          <FiArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/leads"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
        >
          <FiArrowLeft className="h-4 w-4" />
          Leads
        </Link>
      </div>

      <PageHeader
        title={lead.companyName}
        description={`${lead.contactName} · ${lead.industry || 'No industry'}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setModalOpen(true)} className="btn-secondary">
              <FiEdit2 className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-100"
            >
              <FiTrash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>{lead.stage}</Badge>
              <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-600">
                {lead.priority} priority
              </span>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">Contact</dt>
                <dd className="mt-1 text-sm font-medium text-surface-900">{lead.contactName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Deal value</dt>
                <dd className="mt-1 flex items-center gap-1 text-sm font-bold text-surface-900">
                  <FiDollarSign className="h-4 w-4 text-slate-400" />
                  {formatCurrency(lead.value)}
                </dd>
              </div>
              {lead.email && (
                <div>
                  <dt className="text-xs font-medium text-slate-500">Email</dt>
                  <dd className="mt-1 flex items-center gap-1 text-sm text-surface-800">
                    <FiMail className="h-4 w-4 text-slate-400" />
                    <a href={`mailto:${lead.email}`} className="hover:text-brand-600">
                      {lead.email}
                    </a>
                  </dd>
                </div>
              )}
              {lead.phone && (
                <div>
                  <dt className="text-xs font-medium text-slate-500">Phone</dt>
                  <dd className="mt-1 flex items-center gap-1 text-sm text-surface-800">
                    <FiPhone className="h-4 w-4 text-slate-400" />
                    {lead.phone}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-slate-500">Source</dt>
                <dd className="mt-1 text-sm text-surface-800">{lead.source || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Assigned to</dt>
                <dd className="mt-1 flex items-center gap-1 text-sm text-surface-800">
                  <FiUser className="h-4 w-4 text-slate-400" />
                  {lead.assignedTo?.name || 'Unassigned'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Expected close</dt>
                <dd className="mt-1 flex items-center gap-1 text-sm text-surface-800">
                  <FiCalendar className="h-4 w-4 text-slate-400" />
                  {formatDate(lead.expectedCloseDate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Last updated</dt>
                <dd className="mt-1 text-sm text-surface-800">{formatDate(lead.updatedAt)}</dd>
              </div>
            </dl>

            {lead.notes && (
              <div className="mt-6 border-t border-surface-100 pt-4">
                <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Notes
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-surface-700">{lead.notes}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="mb-4 text-base font-semibold text-surface-900">Activity timeline</h3>
            <ActivityFeed activities={activities} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-surface-900">Quick links</h3>
            <div className="mt-3 space-y-2">
              <Link to="/pipeline" className="block text-sm text-brand-600 hover:text-brand-700">
                View on pipeline board →
              </Link>
            </div>
          </div>

          <div className="card bg-surface-50/80">
            <p className="text-xs text-slate-500">Lead ID</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-600">{lead._id}</p>
            <p className="mt-3 text-xs text-slate-500">Created</p>
            <p className="text-sm text-surface-800">{formatDate(lead.createdAt)}</p>
          </div>
        </div>
      </div>

      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit lead"
        form={form}
        onChange={setForm}
        onSubmit={handleUpdate}
        teamMembers={teamMembers}
        saving={saving}
        submitLabel="Save changes"
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete lead"
        message={`Permanently delete "${lead.companyName}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default LeadDetail;
