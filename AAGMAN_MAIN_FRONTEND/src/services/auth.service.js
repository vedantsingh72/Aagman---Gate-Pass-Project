import api from '../api/axios';

export const login = async (credentials) => {
  return await api.post('/api/auth/login', credentials);
};

export const register = async (userData) => {
  return await api.post('/api/users/register', userData);
};

export const registerStudent = async (userData) => {
  return await api.post('/api/users/register', userData);
};

export const registerDepartment = async (departmentData) => {
  return await api.post('/api/department/register', departmentData);
};

export const registerAcademic = async (academicData) => {
  return await api.post('/api/academic/register', academicData);
};

export const registerHostelOffice = async (hostelOfficeData) => {
  return await api.post('/api/hosteloffice/register', hostelOfficeData);
};

export const registerGate = async (gateData) => {
  return await api.post('/api/gate/register', gateData);
};

export const getProfile = async () => {
  return await api.get('/api/auth/me');
};

export const verifyOTP = async (data) => {
  return await api.post('/api/auth/verify-otp', data);
};

export const resendOTP = async (data) => {
  return await api.post('/api/auth/resend-otp', data);
};

export const forgotPassword = async (data) => {
  return await api.post('/api/auth/forgot-password', data);
};

export const resetPassword = async (data) => {
  return await api.post('/api/auth/reset-password', data);
};

