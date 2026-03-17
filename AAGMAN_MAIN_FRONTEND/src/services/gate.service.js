import api from '../api/axios';

export const scanQRCode = async (qrCode) => {
  return await api.post('/api/gate/scan', { qrCode });
};

