import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiUsers } from 'react-icons/fi';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';
import TeamMemberCard from '../components/team/TeamMemberCard';
import TeamMemberForm, { emptyTeamForm, memberToForm } from '../components/team/TeamMemberForm';
import { formatCurrency } from '../utils/formatters';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamPerformance,
} from '../services/teamService';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(emptyTeamForm);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [membersRes, perfRes] = await Promise.all([
        getTeamMembers({ isActive: 'true' }),
        getTeamPerformance(),
      ]);
      setMembers(membersRes.data);
      setTotals(perfRes.data.totals);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditingMember(null);
    setForm(emptyTeamForm);
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setForm(memberToForm(member));
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMember) {
        await updateTeamMember(editingMember._id, form);
      } else {
        await createTeamMember(form);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTeamMember(deleteTarget._id);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete member');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        description="Manage BDA team members and track performance"
        action={
          <button type="button" onClick={openCreate} className="btn-primary">
            <FiPlus className="h-4 w-4" />
            Add member
          </button>
        }
      />

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {totals && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Team leads" value={totals.totalLeads} icon={FiUsers} color="brand" />
          <StatCard title="Active deals" value={totals.activeDeals} color="amber" />
          <StatCard title="Deals won" value={totals.closedWon} color="green" />
          <StatCard
            title="Team revenue"
            value={formatCurrency(totals.totalRevenue)}
            subtitle={`${totals.conversionRate}% conversion`}
            color="purple"
          />
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title="No team members yet"
          description="Add your first BDA team member to start assigning leads"
          action={
            <button type="button" onClick={openCreate} className="btn-primary">
              <FiPlus className="h-4 w-4" />
              Add member
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <TeamMemberCard
              key={member._id}
              member={member}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? 'Edit team member' : 'Add team member'}
      >
        <form onSubmit={handleSubmit}>
          <TeamMemberForm form={form} onChange={setForm} />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingMember ? 'Update' : 'Add member'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove team member"
        message={`Remove ${deleteTarget?.name}? Their assigned leads will be unassigned.`}
        loading={deleting}
      />
    </div>
  );
};

export default Team;
