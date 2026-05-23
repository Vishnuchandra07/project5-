import api from './api';

export const getLeads = async (params = {}) => {
  const { data } = await api.get('/leads', { params });
  return data;
};

export const getLeadById = async (id) => {
  const { data } = await api.get(`/leads/${id}`);
  return data;
};

export const createLead = async (leadData) => {
  const { data } = await api.post('/leads', leadData);
  return data;
};

export const updateLead = async (id, leadData) => {
  const { data } = await api.put(`/leads/${id}`, leadData);
  return data;
};

export const updateLeadStage = async (id, stage) => {
  const { data } = await api.patch(`/leads/${id}/stage`, { stage });
  return data;
};

export const deleteLead = async (id) => {
  const { data } = await api.delete(`/leads/${id}`);
  return data;
};

export const getKanbanBoard = async (params = {}) => {
  const { data } = await api.get('/leads/kanban', { params });
  return data;
};
