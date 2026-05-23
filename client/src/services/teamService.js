import api from './api';

export const getTeamMembers = async (params = {}) => {
  const { data } = await api.get('/team', { params });
  return data;
};

export const getTeamMemberById = async (id) => {
  const { data } = await api.get(`/team/${id}`);
  return data;
};

export const createTeamMember = async (memberData) => {
  const { data } = await api.post('/team', memberData);
  return data;
};

export const updateTeamMember = async (id, memberData) => {
  const { data } = await api.put(`/team/${id}`, memberData);
  return data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await api.delete(`/team/${id}`);
  return data;
};

export const getTeamPerformance = async () => {
  const { data } = await api.get('/team/performance/summary');
  return data;
};
