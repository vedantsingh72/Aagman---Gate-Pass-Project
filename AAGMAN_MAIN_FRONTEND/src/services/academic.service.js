import api from '../api/axios';

export const getPendingPasses = async () => {
  return await api.get('/api/academic/pending');
};

export const getStudentLeaves = async () => {
  return await api.get('/api/academic/student-leaves');
};

export const getDepartmentLeaves = async () => {
  return await api.get('/api/academic/department-leaves');
};

export const getHistory = async () => {
  return await api.get('/api/academic/history');
};

export const getStudentsOut = async () => {
  return await api.get('/api/academic/students-out');
};

export const approvePass = async (passId) => {
  return await api.patch(`/api/academic/approve/${passId}`);
};

export const rejectPass = async (passId) => {
  return await api.patch(`/api/academic/reject/${passId}`);
};

