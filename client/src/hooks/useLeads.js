import { useState, useCallback } from 'react';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../services/leadService';

export const buildLeadPayload = (form) => ({
  companyName: form.companyName.trim(),
  contactName: form.contactName.trim(),
  email: form.email?.trim() || '',
  phone: form.phone?.trim() || '',
  industry: form.industry?.trim() || '',
  source: form.source?.trim() || '',
  stage: form.stage,
  value: Number(form.value) || 0,
  notes: form.notes?.trim() || '',
  priority: form.priority,
  assignedTo: form.assignedTo || null,
  expectedCloseDate: form.expectedCloseDate || null,
});

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const fetchLeads = useCallback(async (params = {}, { silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await getLeads(params);
      setLeads(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load leads';
      setError(message);
      throw err;
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const fetchLead = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeadById(id);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load lead';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addLead = useCallback(async (form) => {
    setError(null);
    try {
      const res = await createLead(buildLeadPayload(form));
      setSuccess('New lead saved');
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create lead';
      setError(message);
      throw err;
    }
  }, []);

  const editLead = useCallback(async (id, form) => {
    setError(null);
    try {
      const res = await updateLead(id, buildLeadPayload(form));
      setSuccess('Lead changes saved');
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update lead';
      setError(message);
      throw err;
    }
  }, []);

  const removeLead = useCallback(async (id) => {
    setError(null);
    try {
      await deleteLead(id);
      setSuccess('Lead removed');
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete lead';
      setError(message);
      throw err;
    }
  }, []);

  return {
    leads,
    setLeads,
    loading,
    error,
    success,
    setSuccess,
    setError,
    clearMessages,
    fetchLeads,
    fetchLead,
    addLead,
    editLead,
    removeLead,
  };
};
