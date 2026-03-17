import api from '../api/axios';

export const getPendingPasses = async () => {
  return await api.get('/api/department/pending');
};

export const getStudentLeaves = async () => {
  return await api.get('/api/department/student-leaves');
};

export const getHistory = async () => {
  return await api.get('/api/department/history');
};

export const getStudentsOut = async () => {
  return await api.get('/api/department/students-out');
};

export const approvePass = async (passId) => {
  return await api.patch(`/api/department/approve/${passId}`);
};

export const rejectPass = async (passId) => {
  return await api.patch(`/api/department/reject/${passId}`);
};

