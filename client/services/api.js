// client/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://10.14.51.167:5000', // your LAN IP:PORT
});

// attach token on every request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('JWT');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
    (r) => r,
    async (err) => {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.msg;
      if (status === 401 && (msg === 'Token has expired' || msg === 'Missing Authorization Header' || msg === 'Bad Authorization header. Expected \'Authorization: Bearer \'')) {
        await AsyncStorage.removeItem('JWT');
        // let the guard send them to login on next paint
      }
      return Promise.reject(err);
    }
  );

export default API;
