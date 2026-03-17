import api from '../api/axios';

export const createPass = async (passData) => {
  return await api.post('/api/passes', passData);
};

export const getMyPasses = async () => {
  return await api.get('/api/passes/my');
};

