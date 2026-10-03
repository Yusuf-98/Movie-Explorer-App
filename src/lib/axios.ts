import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL as string,
  timeout: 10_000,
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

// --- Errors ---
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const MESSAGE_BY_STATUS: Record<number, string> = {
  401: 'Invalid API key. Check your .env file.',
  404: 'Data not found.',
  429: 'Too many requests. Try again shortly.',
};

// --- Response interceptor ---
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status) throw new ApiError(MESSAGE_BY_STATUS[status] ?? error.message, status);
    throw error;
  }
);

export default api;
