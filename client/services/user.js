import API from './api';
export const getMe = () => API.get('/me').then(r => r.data);
