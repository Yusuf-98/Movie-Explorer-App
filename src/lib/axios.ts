import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_TMDB_API_KEY as string,
    language: config.params?.language ?? 'en-US',
  };
  return config;
});

// --- Response interceptor ---
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) throw new Error('Invalid API key. Check your .env file.');
      if (status === 404) throw new Error('Data not found.');
      if (status === 429) throw new Error('Too many requests. Try again shortly.');
    }
    throw error;
  }
);

export default api;
