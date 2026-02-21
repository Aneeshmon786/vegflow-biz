/**
 * VegFlow Biz - API client (unique name to avoid conflicts).
 */
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '/api';

const vegflowApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

vegflowApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('vegflow_access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

vegflowApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vegflow_access');
      localStorage.removeItem('vegflow_refresh');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default vegflowApi;
