import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: Constants.manifestExtra?.API_URL || 'https://your-backend.com',
});

export async function classifyFraud(text) {
  const { data } = await api.post('/api/classify-fraud', { text });
  return data; // { label: 'phish', score: 0.87, explanation: '…' }
}
