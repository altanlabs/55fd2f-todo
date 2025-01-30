import axios from 'axios';

const API_BASE_URL = 'https://api.altan.ai/galaxia/hook/cofiiG';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;