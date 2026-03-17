import api from '../api/axios';

export const getPendingPasses = async () => {
  return await api.get('/api/hosteloffice/pending');
};

export const getHistory = async () => {
  return await api.get('/api/hosteloffice/history');
};

export const getStudentsOut = async () => {
  return await api.get('/api/hosteloffice/students-out');
};

export const getStudentsInside = async () => {
  return await api.get('/api/hosteloffice/students-inside');
};

export const approvePass = async (passId) => {
  return await api.patch(`/api/hosteloffice/approve/${passId}`);
};

export const rejectPass = async (passId) => {
  return await api.patch(`/api/hosteloffice/reject/${passId}`);
};

