import api from './api';

export const getDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

export const getRevenueChart = async () => {
  const { data } = await api.get('/dashboard/revenue-chart');
  return data;
};

export const getConversionStats = async () => {
  const { data } = await api.get('/dashboard/conversion-stats');
  return data;
};
