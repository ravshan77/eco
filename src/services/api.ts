import axios from 'axios';
import { toast } from '../components/ui/use-toast';
import { User, Task } from '../types/types';

// export const base = "https://ecouzkpi-main-9umb8r.laravel.cloud"
// export const baseUrl = `${base}/api`

export const base = "http://192.168.1.2:1010"
export const baseUrl = `${base}/api`

// export const base = "http://10.100.104.111:1010"
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

// Tasks
export const tasksAPI = {
  getAll: () => apiRequest<Task[]>('GET', '/tasks'),
  getById: (id: string) => apiRequest<Task>('GET', `/tasks/${id}`),
  create: (task: Omit<Task, 'id'>) => apiRequest<Task>('POST', '/tasks', task),
  update: (id: string, task: Partial<Task>) => apiRequest<Task>('PATCH', `/tasks/${id}`, task),
  delete: (id: string) => apiRequest('DELETE', `/tasks/${id}`),
  updateStatus: (id: string, status: Task['status']) => apiRequest<Task>('PATCH', `/tasks/${id}/status`, { status }),
};

export default api; 