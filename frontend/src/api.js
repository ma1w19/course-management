import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 8000,
});

export function errorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED')
    return 'Cannot reach the server. Make sure the backend is running on port 5000.';
  return fallback;
}