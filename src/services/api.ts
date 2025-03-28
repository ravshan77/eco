import axios from 'axios';
import { User } from '../types/types';
import { toast } from '../components/ui/use-toast';

// export const base = "https://ecouzkpi-main-9umb8r.laravel.cloud"
// export const baseUrl = `${base}/api`

// export const base = "http://192.168.137.238:1010"
// export const baseUrl = `${base}/api`

export const base = "http://10.100.104.111:1010"
export const baseUrl = `${base}/api`

// export const base = "http://172.20.10.3:1010"
// export const baseUrl = `${base}/api`

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast({ variant: "destructive", title: "So'rov yuborishda xatolik", description: error.message || "Noma'lum xatolik yuz berdi" });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast({ variant: "destructive", title: "Avtorizatsiya xatosi", description: "Iltimos, qaytadan tizimga kiring" });
    } else {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: error.response?.data?.message || error.message || "Noma'lum xatolik yuz berdi" });
    }
    return Promise.reject(error);
  }
);

// Universal API functions
export const apiRequest = async <T>(method: string, url: string, data?: any, headers = {}) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.request<T>({
      method,
      url,
      data,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }), // FormData bo‘lsa, Content-Type avtomatik qo‘shiladi
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth
export const authAPI = {
  login: (email: string, password: string) => apiRequest<{ user: User; token: string }>('POST', '/auth/login', { email, password }),
  logout: () => apiRequest('POST', '/auth/logout'),
};

export default api; 