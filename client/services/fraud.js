// client/services/fraud.js
import API from './api';

export const classify = ({ text, scenario }) =>
  API.post('/classify', { text, scenario }).then(r => r.data);

export const fraudHistory = (scenario) =>
  API.get('/history', { params: { scenario } }).then(r => r.data);
